import { create } from 'zustand'
import createSelectors from './helper/createSelector';
import { ccc } from "@ckb-ccc/core";
import getPDSClient from "@/lib/pdsClient";
import storage from "@/lib/storage";
import { ComAtprotoWeb5CreateAccount, ComAtprotoServerCreateSession } from "web5-api";
import { writesPDSOperation } from "@/app/posts/utils";
import { handleToNickName } from "@/lib/handleToNickName";
import server from "@/server";
import { userLogin } from "@/lib/user-account";

type UserProfileType = {
  did: string
  displayName: string
  highlight?: string  // 在白名单内才有这个字段
  post_count: string
  reply_count: string
  created: string
}

type UserInfoStoreValue = {
  userInfo?: ComAtprotoServerCreateSession.OutputSchema
  initialized?: boolean
  userProfile?: UserProfileType
  isWhiteListUser?: boolean
}


type UserInfoStore = UserInfoStoreValue & {

  setStoreData: (storeData: UserInfoStoreValue) => void
  createUser: (obj: ComAtprotoWeb5CreateAccount.InputSchema) => Promise<void>
  web5Login: () => Promise<void>
  getUserProfile: () => Promise<void>;
  logout: () => void
  initialize: (signer?: ccc.Signer) => Promise<void>
}

const useUserInfoStore = createSelectors(
  create<UserInfoStore>((set, get) => ({
    userInfo: undefined,
    initialized: undefined,
    userProfile: undefined,
    isWhiteListUser: undefined,

    setStoreData: (params) => {
      set(() => ({ ...params }))
    },

    createUser: async (params) => {
      const pdsClient = getPDSClient()
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
          displayName: handleToNickName(userInfo.handle),
        },
        did: userInfo.did,
        rkey: "self"
      })

      set(() => ({ userInfo }))
      get().getUserProfile()
    },

    web5Login: async () => {
      const userInfoRes = await userLogin()

      if (!userInfoRes) return

      set(() => ({ userInfo: userInfoRes }))
      await get().getUserProfile()
    },

    logout: () => {
      storage.removeToken()
      getPDSClient().logout()
      set(() => ({ userInfo: undefined, userProfile: undefined, isWhiteListUser: false, initialized: false }))
    },

    getUserProfile: async () => {
      const userInfo = get().userInfo
      if (!userInfo) return
      const result = await server<UserProfileType>('/repo/profile', 'GET', {
        repo: userInfo.did
      })
      set(() => ({
        userProfile: result,
        isWhiteListUser: !!result.highlight,
      }))
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
