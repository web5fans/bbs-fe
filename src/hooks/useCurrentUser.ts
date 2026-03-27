import useUserInfoStore, { UserInfoStore, UserProfileType } from "@/store/userInfo";
import { useMemo } from "react";

export default function useCurrentUser(): {
  hasLoggedIn: boolean
  isWhiteUser?: boolean
  isAdmin: boolean
  adminType?: 'super' | 'admin'
  userProfile?: UserProfileType
  visitorId?: string
  writeProfile: () => Promise<'NO_NEED' | 'SUCCESS' | 'FAIL'>
  getUserProfile: UserInfoStore['getUserProfile']
  updateProfile: Function
} {
  const store = useUserInfoStore()

  const {
    writeProfile: storeWriteProfile,
    getUserProfile,
    userInfo,
    userProfile,
    visitorId,
    isWhiteListUser,
    keystoreClient,
    keystoreDidKey,
  } = store

  const writeProfile = async () => {
    if (!keystoreClient || !keystoreDidKey) return 'FAIL'
    return await storeWriteProfile(keystoreClient, keystoreDidKey)
  }

  const updateProfile = async () => {
    const status = await writeProfile()
    if (status === 'SUCCESS') {
      await getUserProfile()
    }
  }

  const adminInfo = useMemo(() => {
    if (!userProfile?.tags) return
    const found = userProfile.tags.find(t => t.admin !== undefined && [0, 1].includes(t.admin))
    if (!found) return
    return found?.admin === 0 ? 'super' : 'admin'
  }, [userProfile])

  return {
    hasLoggedIn: !!userInfo,
    isWhiteUser: userInfo && isWhiteListUser,
    isAdmin: !!adminInfo,
    adminType: adminInfo,
    userProfile,
    visitorId,
    writeProfile,
    getUserProfile,
    updateProfile,
  }
}
