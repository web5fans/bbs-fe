'use client'

import useCurrentUser from "@/hooks/useCurrentUser";
import useUserInfoStore from "@/store/userInfo";
import PageNoAuth from "@/components/PageNoAuth";
import React from "react";
import { useRouter } from "next/navigation";

const AuthUserLogged = (props: {
  children: React.ReactNode;
}) => {
  const { hasLoggedIn } = useCurrentUser()
  const initialized = useUserInfoStore(state => state.initialized)

  const router = useRouter()

  if (!initialized) {
    return <div />
  }

  if (hasLoggedIn) {
    return props.children
  }
  return <PageNoAuth
    title={'仅限已注册BBS论坛账号的用户查看'}
    buttonProps={{
      text: '进主站看看',
      onClick: () => router.replace('/posts')
    }}
  />
}

export default AuthUserLogged;
