import useUserInfoStore, { UserInfoStore, UserProfileType } from "@/store/userInfo";
import { useMemo } from "react";

export default function useCurrentUser(): {
  hasLoggedIn: boolean
  isWhiteUser?: boolean
  isAdmin: boolean
  adminType?: 'super' | 'admin'
  userProfile?: UserProfileType
  visitorId?: string
  writeProfile: UserInfoStore['writeProfile']
  getUserProfile: UserInfoStore['getUserProfile']
  updateProfile: Function
} {
  const { writeProfile,
    getUserProfile,
    userInfo,
    userProfile,
    visitorId,
    isWhiteListUser,
  } = useUserInfoStore()

  // const isWhiteListUser = true;

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