import getPDSClient from "@/lib/pdsClient";
import storage, { TokenStorageType } from "@/lib/storage";
import { Secp256k1Keypair } from "@atproto/crypto";
import { bytesFrom, hexFrom } from "@ckb-ccc/core";
import { ComAtprotoWeb5IndexAction, ComAtprotoWeb5PreIndexAction } from "web5-api";
import { showGlobalToast } from "@/provider/toast";
import server from "@/server";
import { UserProfileType } from "@/store/userInfo";

export async function fetchUserProfile(did: string): Promise<UserProfileType> {
  const result = await server<UserProfileType>('/repo/profile', 'GET', {
    repo: did
  })
  return result
}

export async function userLogin(localStorage: TokenStorageType): Promise<ComAtprotoWeb5IndexAction.CreateSessionResult | undefined> {
  const pdsClient = getPDSClient()
  const { did, signKey, walletAddress } = localStorage

  const preLoginIndex = {
    $type: 'com.atproto.web5.preIndexAction#createSession',
  }

  let preLogin: ComAtprotoWeb5PreIndexAction.Response

  try {
    preLogin = await pdsClient.com.atproto.web5.preIndexAction({
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
    $type: 'com.atproto.web5.indexAction#createSession',
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
    return loginInfo.data.result as ComAtprotoWeb5IndexAction.CreateSessionResult

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
    $type: 'com.atproto.web5.preIndexAction#deleteAccount',
  }
  const pdsClient = getPDSClient()
  const preDelete = await pdsClient.com.atproto.web5.preIndexAction({
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
    $type: 'com.atproto.web5.indexAction#deleteAccount',
  }

  const deleteInfo = await pdsClient.com.atproto.web5.indexAction({
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