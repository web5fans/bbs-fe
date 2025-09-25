import { create } from 'zustand'
import createSelectors from './helper/createSelector';
import { ccc } from "@ckb-ccc/core";
import getPDSClient from "@/lib/pdsClient";
import storage, { TokenStorageType } from "@/lib/storage";
import { ComAtprotoWeb5CreateAccount, ComAtprotoServerCreateSession } from "web5-api";
import { postsWritesPDSOperation } from "@/app/posts/utils";
import { handleToNickName } from "@/lib/handleToNickName";
import { fetchUserProfile, userLogin } from "@/lib/user-account";

export type UserProfileType = {
  did: string
  displayName?: string
  highlight?: string  // 在白名单内才有这个字段
  post_count?: string
  comment_count?: string
  created?: string
  handle?: string
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
  getUserProfile: () => Promise<UserProfileType | undefined>;
  logout: () => void
  writeProfile: () => Promise<'NO_NEED' | 'SUCCESS' | 'FAIL'>
  resetUserStore: () => void
  initialize: (signer?: ccc.Signer) => Promise<void>
  importUserDid: (info: TokenStorageType) => Promise<void>
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

      set(() => ({ userInfo, userProfile: { did: userInfo.did, handle: userInfo.handle } }))
    },

    writeProfile: async () => {
      const { userInfo, userProfile } = get();
      if (!userInfo || (userProfile && userProfile.displayName)) return 'NO_NEED'

      try {
        await postsWritesPDSOperation({
          record: {
            $type: "app.actor.profile",
            displayName: handleToNickName(userInfo.handle),
            handle: userInfo.handle
          },
          did: userInfo.did,
          rkey: "self"
        })
        return 'SUCCESS'
      } catch (e) {
        console.log('write profile err')
        return 'FAIL'
      }
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
      const result = await fetchUserProfile(userInfo.did)

      set(() => ({
        userProfile: { ...result, handle: userInfo.handle },
        isWhiteListUser: !!result.highlight,
      }))

      // 没有displayName说明需要补充写入profile
      if (!result.displayName) {
        const status = await get().writeProfile()
        if (status === 'SUCCESS') {
          const profile = await fetchUserProfile(userInfo.did)
          set(() => ({ userProfile: profile }))
          return profile
        }
      }

      return result
    },

    initialize: async () => {
      await get().web5Login()
      let visitor = localStorage.getItem(STORAGE_VISITOR)
      if (!visitor) {
        const random4Digit = Math.floor(Math.random() * 9000) + 1000;
        visitor = random4Digit.toString()
        localStorage.setItem(STORAGE_VISITOR, visitor)
      }
      set(() => ({ initialized: true, visitorId: visitor }))
    },

    importUserDid: async (info) => {
      storage.setToken(info)
      await get().web5Login()
    }

  })),
)

export default useUserInfoStore
