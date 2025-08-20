import useUserInfoStore from "@/store/userInfo";

export default function useCurrentUser() {
  const { userInfo, isWhiteListUser, userProfile } = useUserInfoStore()

  return {
    hasLoggedIn: !!userInfo,
    isWhiteUser: userInfo && isWhiteListUser,
    userProfile,
  }
}