import getPDSClient, { setPDSClient } from "@/lib/pdsClient";
import storage, { TokenStorageType } from "@/lib/storage";
import { bytesFrom, hexFrom } from "@ckb-ccc/core";
import { FansWeb5CkbIndexAction, FansWeb5CkbPreIndexAction } from "web5-api";
import { showGlobalToast } from "@/provider/toast";
import server from "@/server";
import { UserProfileType } from "@/store/userInfo";
import axios from "axios";
import { DID_INDEXER } from "@/constant/Network";
import type { KeystoreClient } from "keystore/KeystoreClient";

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

interface UserLoginParams {
  localStorage: TokenStorageType;
  client: KeystoreClient;
  didKey: string;
}

export async function userLogin({ localStorage, client, didKey }: UserLoginParams): Promise<FansWeb5CkbIndexAction.CreateSessionResult | undefined> {
  const { did, walletAddress } = localStorage

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
  } catch (err: any) {
    if (err.error === 'CkbDidocCellNotFound') {
      console.log('CkbDidocCellNotFound')
      showGlobalToast({ title: err.message, icon: 'error' })
      return
    }
  }

  if (!preLogin) return

  const messageBytes = bytesFrom(preLogin.data.message, 'utf8')
  const loginSig = await client.signMessage(messageBytes)

  const loginIndex = {
    $type: 'fans.web5.ckb.indexAction#createSession',
  }

  const signingKey = didKey

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

interface DeleteErrUserParams {
  did: string;
  address: string;
  client: KeystoreClient;
  didKey: string;
}

export async function deleteErrUser({ did, address, client, didKey }: DeleteErrUserParams) {
  const preDelectIndex = {
    $type: 'fans.web5.ckb.preIndexAction#deleteAccount',
  }
  const pdsClient = getPDSClient()
  const preDelete = await pdsClient.fans.web5.ckb.preIndexAction({
    did,
    ckbAddr: address,
    index: preDelectIndex,
  })

  const signingKey = didKey
  const messageBytes = bytesFrom(preDelete.data.message, 'utf8')
  const deleteSig = await client.signMessage(messageBytes)

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
