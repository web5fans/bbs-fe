import useUserInfoStore from "@/store/userInfo";

export default function useCurrentUser() {
  const { userInfo, isWhiteListUser, userProfile, visitorId } = useUserInfoStore()

  return {
    hasLoggedIn: !!userInfo,
    isWhiteUser: userInfo && isWhiteListUser,
    userProfile,
    visitorId
  }
}