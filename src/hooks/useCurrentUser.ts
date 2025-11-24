import useUserInfoStore from "@/store/userInfo";

export default function useCurrentUser() {
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