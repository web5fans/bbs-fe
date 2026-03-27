import { create } from 'zustand'
import getPDSClient from "@/lib/pdsClient";
import storage, { TokenStorageType } from "@/lib/storage";
import { FansWeb5CkbCreateAccount, ComAtprotoServerCreateSession } from "web5-api";
import { postsWritesPDSOperation } from "@/app/posts/utils";
import { handleToNickName } from "@/lib/handleToNickName";
import { fetchUserProfile, userLogin } from "@/lib/user-account";
import type { KeystoreClient } from "@/lib/keystore-client";

export type UserProfileType = {
  did: string
  displayName?: string
  highlight?: string
  post_count?: string
  comment_count?: string
  created?: string
  handle?: string
  ckb_addr: string
  tags?: ({ owner: string; admin: undefined } | { admin: 0 | 1; owner: undefined })[]
}

type UserInfoStoreValue = {
  userInfo?: ComAtprotoServerCreateSession.OutputSchema
  initialized?: boolean
  userProfile?: UserProfileType
  isWhiteListUser?: boolean
  visitorId?: string
  keystoreClient?: KeystoreClient | null
  keystoreDidKey?: string | null
}

const STORAGE_VISITOR = '@bbs:visitor'

export type UserInfoStore = UserInfoStoreValue & {
  setStoreData: (storeData: UserInfoStoreValue) => void
  setKeystoreContext: (client: KeystoreClient | null, didKey: string | null) => void
  storageUserInfo: (params: { signingKeyDid: string; ckbAddr: string; userInfo: FansWeb5CkbCreateAccount.OutputSchema}) => void
  web5Login: (client: KeystoreClient, didKey: string, did?: string, walletAddress?: string) => Promise<boolean>
  getUserProfile: () => Promise<UserProfileType | undefined>;
  logout: () => void
  writeProfile: (client: KeystoreClient, didKey: string) => Promise<'NO_NEED' | 'SUCCESS' | 'FAIL'>
  resetUserStore: () => void
  initialize: () => Promise<void>
  importUserDid: (info: TokenStorageType) => Promise<void>
}

const useUserInfoStore = create<UserInfoStore>((set, get) => ({
    userInfo: undefined,
    initialized: undefined,
    userProfile: undefined,
    isWhiteListUser: undefined,
    visitorId: undefined,
    keystoreClient: undefined,
    keystoreDidKey: undefined,

    setStoreData: (params) => {
      set(() => ({ ...params }))
    },

    setKeystoreContext: (client, didKey) => {
      set(() => ({ keystoreClient: client, keystoreDidKey: didKey }))
    },

    storageUserInfo: async ({ signingKeyDid, ckbAddr, userInfo }) => {
      storage.setToken({
        did: userInfo.did,
        signingKeyDid,
        walletAddress: ckbAddr
      })

      set(() => ({ userInfo, userProfile: { did: userInfo.did, handle: userInfo.handle, ckb_addr: ckbAddr } }))
    },

    writeProfile: async (client: KeystoreClient, didKey: string) => {
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
          rkey: "self",
          client,
          didKey
        })
        return 'SUCCESS'
      } catch (e) {
        console.log('write profile err')
        return 'FAIL'
      }
    },

    web5Login: async (client: KeystoreClient, didKey: string, did?: string, walletAddress?: string): Promise<boolean> => {
      let localStorage = storage.getToken()

      if (!localStorage) {
        if (!did || !walletAddress) {
          console.error('web5Login: Missing did and walletAddress')
          return false
        }
        localStorage = {
          did,
          walletAddress,
          signingKeyDid: didKey,
        }
        storage.setToken(localStorage)
      }

      const userInfoRes = await userLogin({ localStorage, client, didKey })

      if (!userInfoRes) return false

      storage.setToken({
        ...localStorage,
        accessJwt: userInfoRes.accessJwt,
        refreshJwt: userInfoRes.refreshJwt,
      })

      await getPDSClient().resumeSession({
        accessJwt: userInfoRes.accessJwt,
        refreshJwt: userInfoRes.refreshJwt,
        did: userInfoRes.did,
        handle: userInfoRes.handle,
        active: true,
      })

      set(() => ({ userInfo: userInfoRes, keystoreClient: client, keystoreDidKey: didKey }))
      await get().getUserProfile()
      return true
    },

    logout: () => {
      storage.removeToken()
      get().resetUserStore()
    },

    resetUserStore() {
      getPDSClient().logout()
      set(() => ({ 
        userInfo: undefined, 
        userProfile: undefined, 
        isWhiteListUser: false,
        keystoreClient: undefined,
        keystoreDidKey: undefined
      }))
    },

    getUserProfile: async () => {
      const userInfo = get().userInfo
      if (!userInfo) return
      const result = await fetchUserProfile(userInfo.did)

      set(() => ({
        userProfile: { ...result, handle: userInfo.handle },
        isWhiteListUser: !!result.highlight,
      }))

      const { keystoreClient, keystoreDidKey } = get()
      if (!result.displayName && keystoreClient && keystoreDidKey) {
        const status = await get().writeProfile(keystoreClient, keystoreDidKey)
        if (status === 'SUCCESS') {
          const profile = await fetchUserProfile(userInfo.did)
          set(() => ({ userProfile: profile }))
          return profile
        }
      }

      return result
    },

    initialize: async () => {
      const hasToken = storage.getToken()

      if (hasToken) {
        set(() => ({
          userInfo: {
            did: hasToken.did,
            handle: hasToken.did,
          } as ComAtprotoServerCreateSession.OutputSchema,
          userProfile: {
            did: hasToken.did,
            ckb_addr: hasToken.walletAddress,
            handle: hasToken.did,
          } as UserProfileType,
        }))

        if (hasToken.accessJwt && hasToken.refreshJwt) {
          try {
            await getPDSClient().resumeSession({
              accessJwt: hasToken.accessJwt,
              refreshJwt: hasToken.refreshJwt,
              did: hasToken.did,
              handle: hasToken.did,
              active: true,
            })
          } catch (err) {
            console.log('Failed to resume PDS session:', err)
          }
        }
      }
      
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
    }

  }))

export default useUserInfoStore
