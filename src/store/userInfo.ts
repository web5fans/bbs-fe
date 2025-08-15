import { create } from 'zustand'
import createSelectors from './helper/createSelector';
import { ccc } from "@ckb-ccc/core";
import usePDSClient from "@/hooks/usePDSClient";
import storage from "@/lib/storage";
import { ComAtprotoWeb5CreateAccount, ComAtprotoServerCreateSession } from "web5-api";
import { writesPDSOperation } from "@/app/posts/utils";
import { handleToNickName } from "@/lib/handleToNickName";

type UserInfoStoreValue = {
  createdTx?: ccc.Transaction
  did?: string
  userInfo?: ComAtprotoServerCreateSession.OutputSchema
  initialized?: boolean
}


type UserInfoStore = UserInfoStoreValue & {

  setStoreData: (storeData: UserInfoStoreValue) => void
  createUser: (obj: ComAtprotoWeb5CreateAccount.InputSchema) => Promise<void>
  web5Login: () => Promise<void>
  logout: () => void
  initialize: (signer?: ccc.Signer) => Promise<void>
}

const useUserInfoStore = createSelectors(
  create<UserInfoStore>((set, get) => ({
    createTx: undefined,
    did: undefined,
    userInfo: undefined,
    initialized: undefined,

    setStoreData: (params) => {
      set(() => ({ ...params }))
    },

    createUser: async (params) => {
      const pdsClient = usePDSClient()
      const createRes = await pdsClient.web5CreateAccount(params)
      const userInfo = createRes.data

      storage.setToken({
        did: userInfo.did,
        signKey: params.password,
        walletAddress: params.ckbAddr
      })

      writesPDSOperation({
        record: {
          $type: "app.actor.profile",
          display_name: handleToNickName(userInfo.handle),
        },
        did: userInfo.did,
        rkey: "self"
      })

      set(() => ({ userInfo }))
    },

    web5Login: async () => {
      const localStorage = storage.getToken()

      if (!localStorage) return

      const { did, signKey, walletAddress } = localStorage

      const pdsClient = usePDSClient()
      const userInfoRes = await pdsClient.web5Login({
        identifier: did,
        password: signKey!,
        ckbAddr: walletAddress
      })

      set(() => ({ userInfo: userInfoRes.data }))
    },

    logout: () => {
      storage.removeToken()
      set(() => ({ userInfo: undefined }))
    },

    // getSigningKey: (walletAddress) => {
    //   if (get().signingKey) {
    //     return get().signingKey;
    //   }
    //   const signingKeyMap = storage.getToken();
    //
    //   const key = signingKeyMap?.[walletAddress];
    //   if (key) {
    //     set(() => ({ signingKey: key }))
    //   }
    //   return key
    // },

    initialize: async () => {
      await get().web5Login()
      set(() => ({ initialized: true }))
    }

  })),
)

export default useUserInfoStore
