'use client'

import useCurrentUser from "@/hooks/useCurrentUser";
import PageNoAuth from "@/components/PageNoAuth";
import React from "react";
import { useRouter } from "next/navigation";

const AuthUserLogged = (props: {
  children: React.ReactNode;
}) => {
  const { hasLoggedIn } = useCurrentUser()

  const router = useRouter()

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