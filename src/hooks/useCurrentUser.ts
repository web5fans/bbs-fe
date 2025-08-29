import useUserInfoStore from "@/store/userInfo";

export default function useCurrentUser() {
  const { writeProfile,
    getUserProfile,
    userInfo,
    isWhiteListUser,
    userProfile,
    visitorId,
  } = useUserInfoStore()

  const updateProfile = async () => {
    const status = await writeProfile()
    if (status === 'SUCCESS') {
      await getUserProfile()
    }
  }

  return {
    hasLoggedIn: !!userInfo,
    isWhiteUser: userInfo && isWhiteListUser,
    userProfile,
    visitorId,
    writeProfile,
    getUserProfile,
    updateProfile,
  }
}