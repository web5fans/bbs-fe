import getPDSClient from "@/lib/pdsClient";
import { ccc } from "@ckb-ccc/core";
import axios from "axios";
import { formatMessageForSigning, generateDid, generateWeb3LoginMessage } from "@/lib/utils";
import useUserInfoStore from "@/store/userInfo";
import { DidWeb5Data } from "@/lib/molecules";
import { hexToUint8Array } from "@/lib/dag-cbor";
import * as cbor from "@ipld/dag-cbor";

export enum AFTER_CHECK_DID_OPT {
  CONNECT_WALLET = "CONNECT_WALLET",
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN'
}

export default async function useCheckUserHadDid(signer?: ccc.Signer) {
  if (!signer) {
    // todo 去连接钱包
    return AFTER_CHECK_DID_OPT.CONNECT_WALLET
  }

  const fromAddress = await signer.getAddresses()
  const address = fromAddress[0]

  // const signingKey = useUserInfoStore.use.getSigningKey()(address)
  //
  // if (!signingKey) {
  //   // todo 注册
  //   return AFTER_CHECK_DID_OPT.REGISTER
  // }

  const { script: lock } = await ccc.Address.fromString(
    address,
    signer.client,
  )

  const address_hash = lock.hash()
  const queryUrl = `http://testnet-api.explorer.nervos.org/api/v2/scripts/referring_cells?code_hash=0x510150477b10d6ab551a509b71265f3164e9fd4137fcb5a4322f49f03092c7c5&hash_type=type&sort=created_time.asc&address_hash=${address_hash}&restrict=false&page=1&page_size=1`
  const http_res = await axios
    .get(queryUrl, {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    })
    .catch((error) => {
      console.error('Error:', error)
    })

  const referringCells = http_res.data.data.referring_cells

  // 有did
  if (referringCells.length != 0 && referringCells[0].status == 'live') {
    const findedCell = await signer.client.getCell({
      txHash: referringCells[0].tx_hash,
      index: referringCells[0].cell_index,
    })

    const did = generateDid(findedCell.cellOutput.type.args)
    const didata = DidWeb5Data.fromBytes(findedCell.outputData)
    const didoc = cbor.decode(hexToUint8Array(didata.value.document))
    const userHandle = didoc.alsoKnownAs[0].replace('at://', '')

    const pdsClient = getPDSClient()

    // todo 走登录流程
    const message = generateWeb3LoginMessage(address, pdsClient.serviceUrl.origin, userHandle) // change to front domain

    const signature = await signer.signMessage(
      formatMessageForSigning(message),
    )
    if (
      !(await signer.verifyMessage(
        formatMessageForSigning(message),
        signature,
      ))
    ) {
      throw 'signing login error invalid wallet'
    }

    await useUserInfoStore.use.web5Login()()

    return AFTER_CHECK_DID_OPT.LOGIN
  }

  return AFTER_CHECK_DID_OPT.REGISTER
}