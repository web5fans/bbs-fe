import { useNickName } from "@/provider/RegisterNickNameProvider";
import { useWallet } from "@/provider/WalletProvider";
import getPDSClient from "@/lib/pdsClient";
import { Secp256k1Keypair } from "@atproto/crypto";
import * as cbor from "@ipld/dag-cbor";
import { ccc, hexFrom, Script, numFrom, fixedPointToString } from '@ckb-ccc/core'
import { tokenConfig } from "@/constant/token";
import { DidWeb5Data } from "@/lib/molecules";
import { useEffect, useRef, useState } from "react";
import useUserInfoStore from "@/store/userInfo";
import { base32 } from "@scure/base";
import { hexToUint8Array, uint8ArrayToHex } from "@/lib/dag-cbor";
import { UnsignedCommit } from "@atproto/repo";
import { CID } from "multiformats";
import { deleteErrUser } from "@/lib/user-account";

export enum CREATE_STATUS {
  INIT,
  SUCCESS,
  FAILURE
}

export type CreateAccountStatus = { status: CREATE_STATUS; reason?: string }

const initialCapacity = 355

const SEND_TRANSACTION_ERR_MESSAGE = 'SendTransaction Error'

type CreateUserParamsType = {
  did?: string
  createdTx?: ccc.Transaction
  createdSignKeyPriv?: string
}

export default function useCreateAccount({ createSuccess }: {
  createSuccess?: () => void
}) {
  const { userHandle } = useNickName()
  const { signer, walletClient, address } = useWallet()
  const { createUser, logout } = useUserInfoStore()

  const [extraIsEnough, setExtraIsEnough] = useState([initialCapacity, false])

  const [createLoading, setCreateLoading] = useState(false)
  const [createStatus, setCreateStatus] = useState<CreateAccountStatus>({
    status: CREATE_STATUS.INIT
  })

  const intervalRef = useRef(null);

  const createUserParamsRef = useRef<CreateUserParamsType>({
    did: undefined,
    createdTx: undefined,
    createdSignKeyPriv: undefined
  })

  const changeParams = (obj: CreateUserParamsType) => {
    createUserParamsRef.current = {...createUserParamsRef.current, ...obj}
  }

  // 判断CKB是否足够
  const validateIsEnough = async () => {
    // console.log('pollingGetExtra', dayjs().format('YYYY-MM-DD HH:mm:ss'))
    if (!signer) return
    const fromAddress = await signer.getAddresses()

    const keyPair = await Secp256k1Keypair.create({
      exportable: true
    })
    const signKeyPriv = await keyPair.export()
    const strSignKeyPriv = ccc.hexFrom(signKeyPriv)
    const signingKey = keyPair.did()

    const diDoc = {
      verificationMethods: {
        atproto: signingKey,
      },
      alsoKnownAs: [`at://${userHandle}`],
      services: {
        atproto_pds: {
          type: 'AtprotoPersonalDataServer',
          endpoint: getPDSClient().serviceUrl.origin,
        },
      },
    }

    const didWeb5Data0 = DidWeb5Data.from({
      value: {
        document: cbor.encode(diDoc),
        localId: null,
      },
    })
    const didWeb5Data0Str = hexFrom(didWeb5Data0.toBytes())
    // console.log(didWeb5Data0Str)

    const { script: lock } = await ccc.Address.fromString(
      fromAddress[0],
      signer.client,
    )

    let cell = null

    for await (const c of signer.findCells(
      {
        scriptLenRange: [0, 1],
        outputDataLenRange: [0, 1],
      },
      true,
      'desc',
      1,
    )) {
      cell = c
    }
    if (!cell) {
      startPolling()
      return
    }

    let input = ccc.CellInput.from({ previousOutput: cell.outPoint })

    const args = ccc.hashCkb(
      ccc.bytesConcat(input.toBytes(), ccc.numLeToBytes(0, 8)),
    )

    const type = new Script(tokenConfig.codeHash, tokenConfig.hashType, args)

    const tx = ccc.Transaction.from({
      inputs: [{ previousOutput: input.previousOutput }],
      outputs: [{ lock, type }],
      outputsData: [didWeb5Data0Str],
    })
    await tx.addCellDepInfos(walletClient!, tokenConfig.cellDeps)

    try {
      await tx.completeInputsByCapacity(signer)
      setExtraIsEnough([0, true])
    } catch (error) {
      const expectedCapacity = fixedPointToString(tx.getOutputsCapacity() + numFrom(0))
      setExtraIsEnough([expectedCapacity, false])
      startPolling()
      return
    }

    await tx.completeFeeBy(signer)

    const preDid = base32.encode(hexToUint8Array(args.slice(2, 42))).toLowerCase()

    changeParams({
      createdTx: tx,
      did: `did:web5:${preDid}`,
      createdSignKeyPriv: strSignKeyPriv
    })
  }


  // 启动轮询
  const startPolling = () => {
    if (intervalRef.current) return

    // 设置10秒轮询
    intervalRef.current = setInterval(validateIsEnough, 10000);
  };

  // 停止轮询
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const prepareAccount = async () => {
    setCreateLoading(true)

    const signKey = createUserParamsRef.current.createdSignKeyPriv

    const keyPair = await Secp256k1Keypair.import(signKey?.slice(2))

    const signingKey = keyPair.did()

    const res = await getPDSClient().com.atproto.web5.preCreateAccount({
      handle: userHandle!,
      signingKey,
      did: createUserParamsRef.current.did!,
    })

    const preCreateResult = res.data

    let uncommit: UnsignedCommit = {
      did: preCreateResult.did,
      version: 3,
      rev: preCreateResult.rev,
      prev: preCreateResult.prev ?? null,
      data: CID.parse(preCreateResult.data),
    }
    const preEncoded = cbor.encode(uncommit)

    if (uint8ArrayToHex(preEncoded) !== preCreateResult.unSignBytes) {
      throw 'sign bytes not consistent'
    }

    // const commit = await signCommit(uncommit, keyPair)  会报错，所以就把源码拿出来了
    const encoded = cbor.encode(uncommit)
    const sig = await keyPair.sign(encoded)
    const commit =  {
      ...uncommit,
      sig,
    }

    await createUser({
      handle: userHandle!,
      password: signKey,
      signingKey,
      ckbAddr: address,
      root: {
        did: preCreateResult.did,
        version: 3,
        rev: preCreateResult.rev,
        prev: preCreateResult.prev,
        data: preCreateResult.data,
        signedBytes: uint8ArrayToHex(commit.sig),
      },
    })

    let txHash;

    const createdTx = createUserParamsRef.current.createdTx

    try {
      txHash = await signer?.sendTransaction(createdTx!)
    } catch (error) {
      throw new Error(SEND_TRANSACTION_ERR_MESSAGE);
    }

    console.log('txHash', txHash)
    if (!txHash) return
    const txRes = await walletClient?.waitTransaction(txHash)
    console.log('txRes', txRes)
    if (txRes?.status !== 'committed') {
      await deleteErrUser(preCreateResult.did, address, signKey!)
    }

    setCreateLoading(false)
    createSuccess?.()
    setCreateStatus({
      status: CREATE_STATUS.SUCCESS,
      reason: undefined
    })
  }

  const createAccount = async () => {
    stopPolling()

    try {
      await prepareAccount()
    } catch (err) {
      console.log('err.message', err.message)

      if (err.message === SEND_TRANSACTION_ERR_MESSAGE) {
        const params = createUserParamsRef.current
        await deleteErrUser(params.did!, address, params.createdSignKeyPriv!)
      }

      logout()

      setCreateLoading(false)
      setCreateStatus({
        status: CREATE_STATUS.FAILURE,
        reason: err.message || err
      })
      changeParams({
        did: undefined,
        createdTx: undefined,
        createdSignKeyPriv: undefined,
      })
    }
  }

  useEffect(() => {
    stopPolling();
    setCreateStatus({
      status: CREATE_STATUS.INIT,
      reason: undefined
    })
    setExtraIsEnough([initialCapacity, false])
    validateIsEnough()
  }, [signer]);

  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, []);

  return {
    extraIsEnough,
    createAccount,
    loading: createLoading,
    createStatus,
    resetCreateStatus: () => {
      setCreateStatus({
        status: CREATE_STATUS.INIT,
        reason: undefined
      })
    }
  }
}