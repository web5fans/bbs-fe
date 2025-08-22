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

export type UserProfileType = {
  did: string
  displayName: string
  highlight?: string  // 在白名单内才有这个字段
  post_count: string
  reply_count: string
  created: string
  handle: string
}

type UserInfoStoreValue = {
  userInfo?: ComAtprotoServerCreateSession.OutputSchema
  initialized?: boolean
  userProfile?: UserProfileType
  isWhiteListUser?: boolean
  visitorId?: string
}

const STORAGE_VISITOR = '@bbs:visitor'


type UserInfoStore = UserInfoStoreValue & {

  setStoreData: (storeData: UserInfoStoreValue) => void
  createUser: (obj: ComAtprotoWeb5CreateAccount.InputSchema) => Promise<void>
  web5Login: () => Promise<void>
  getUserProfile: () => Promise<void>;
  logout: () => void
  resetUserStore: () => void
  initialize: (signer?: ccc.Signer) => Promise<void>
}

const useUserInfoStore = createSelectors(
  create<UserInfoStore>((set, get) => ({
    userInfo: undefined,
    initialized: undefined,
    userProfile: undefined,
    isWhiteListUser: undefined,
    visitorId: undefined,

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

      await writesPDSOperation({
        record: {
          $type: "app.actor.profile",
          displayName: handleToNickName(userInfo.handle),
          handle: userInfo.handle
        },
        did: userInfo.did,
        rkey: "self"
      })

      set(() => ({ userInfo }))
      get().getUserProfile()
    },

    web5Login: async () => {
      const localStorage = storage.getToken()

      if (!localStorage) return

      const userInfoRes = await userLogin(localStorage)

      if (!userInfoRes) return

      set(() => ({ userInfo: userInfoRes }))
      await get().getUserProfile()
    },

    /* 清除用户信息+缓存 */
    logout: () => {
      storage.removeToken()
      get().resetUserStore()
    },

    /* 只清除用户信息，保留缓存 */
    resetUserStore() {
      getPDSClient().logout()
      set(() => ({ userInfo: undefined, userProfile: undefined, isWhiteListUser: false }))
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
      let visitor = localStorage.getItem(STORAGE_VISITOR)
      if (!visitor) {
        const random4Digit = Math.floor(Math.random() * 9000) + 1000;
        visitor = random4Digit.toString()
        localStorage.setItem(STORAGE_VISITOR, visitor)
      }
      set(() => ({ initialized: true, visitorId: visitor }))
    }

  })),
)

export default useUserInfoStore
