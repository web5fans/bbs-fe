import getPDSClient, { setPDSClient } from "@/lib/pdsClient";
import storage, { TokenStorageType } from "@/lib/storage";
import { Secp256k1Keypair } from "@atproto/crypto";
import { bytesFrom, hexFrom } from "@ckb-ccc/core";
import { FansWeb5CkbIndexAction, FansWeb5CkbPreIndexAction } from "web5-api";
import { showGlobalToast } from "@/provider/toast";
import server from "@/server";
import { UserProfileType } from "@/store/userInfo";
import axios from "axios";
import { DID_INDEXER } from "@/constant/Network";

export async function fetchUserProfile(did: string): Promise<UserProfileType> {
  const result = await server<UserProfileType>('/repo/profile', 'GET', {
    repo: did
  })
  return result
}

async function setLoginUserPDSClient(did: string) {
  let res = null
  try {
    const response = await axios(`${DID_INDEXER}/${did}`, {
      method: 'GET',
    })
    const service = response.data.services.atproto_pds.endpoint
    res = service
    setPDSClient(service)
  } catch (err) {

  }

  return res
}

export async function userLogin(localStorage: TokenStorageType): Promise<FansWeb5CkbIndexAction.CreateSessionResult | undefined> {
  const { did, signKey, walletAddress } = localStorage

  const clientService = await setLoginUserPDSClient(did)
  if (!clientService) return

  const pdsClient = getPDSClient()

  const preLoginIndex = {
    $type: 'fans.web5.ckb.preIndexAction#createSession',
  }

  let preLogin: FansWeb5CkbPreIndexAction.Response | undefined = undefined

  try {
    preLogin = await pdsClient.fans.web5.ckb.preIndexAction({
      did,
      ckbAddr: walletAddress,
      index: preLoginIndex,
    })
  } catch (err) {
    if (err.error === 'CkbDidocCellNotFound') {
      console.log('CkbDidocCellNotFound')
      // await deleteErrUser(did, walletAddress, signKey)
      showGlobalToast({ title: err.message, icon: 'error' })
      return
    }
  }

  if (!preLogin) return

  const keyPair = await Secp256k1Keypair.import(signKey?.slice(2))
  const loginSig = await keyPair.sign(
    bytesFrom(preLogin.data.message, 'utf8'),
  )

  const loginIndex = {
    $type: 'fans.web5.ckb.indexAction#createSession',
  }

  const signingKey = keyPair.did()

  try {
    const loginInfo = await pdsClient.web5Login({
      did,
      message: preLogin.data.message,
      signingKey: signingKey,
      signedBytes: hexFrom(loginSig),
      ckbAddr: walletAddress,
      index: loginIndex,
    })
    return loginInfo.data.result as FansWeb5CkbIndexAction.CreateSessionResult

  } catch (err) {
    showGlobalToast({
      title: '登录失败',
      icon: 'error',
      duration: 4000
    })
  }
}


export async function deleteErrUser(did: string, address: string, signKey: string) {
  const preDelectIndex = {
    $type: 'fans.web5.ckb.preIndexAction#deleteAccount',
  }
  const pdsClient = getPDSClient()
  const preDelete = await pdsClient.fans.web5.ckb.preIndexAction({
    did,
    ckbAddr: address,
    index: preDelectIndex,
  })

  const keyPair = await Secp256k1Keypair.import(signKey?.slice(2))
  const signingKey = keyPair.did()
  const deleteSig = await keyPair.sign(
    bytesFrom(preDelete.data.message, 'utf8'),
  )

  const deleteIndex = {
    $type: 'fans.web5.ckb.indexAction#deleteAccount',
  }

  const deleteInfo = await pdsClient.fans.web5.ckb.indexAction({
    did,
    message: preDelete.data.message,
    signingKey,
    signedBytes: hexFrom(deleteSig),
    ckbAddr: address,
    index: deleteIndex,
  })

  storage.removeToken()
  console.log('web5 delete account finish')
}