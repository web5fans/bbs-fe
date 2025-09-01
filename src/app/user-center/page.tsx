'use client'

import CardWindow from "@/components/CardWindow";
import S from "./index.module.scss";
import BreadCrumbs from "@/components/BreadCrumbs";
import UserInfo from "@/app/user-center/components/UserInfo";
import BBSDataSelf from "@/app/user-center/components/BBSDataSelf";
import DataDetail from "@/app/user-center/components/DataDetail";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRequest } from "ahooks";
import server from "@/server";
import { UserProfileType } from "@/store/userInfo";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleToNickName } from "@/lib/handleToNickName";
import { LayoutCenter } from "@/components/Layout";

const Page = () => {
  const { userProfile, hasLoggedIn, writeProfile, getUserProfile } = useCurrentUser()

  const router = useRouter();

  const { data: userInfo } = useRequest(async () => {
    await writeProfile()
    const info = await getUserProfile()
    return {
      ...info,
      handle: info?.handle || userProfile?.handle,
      displayName: info?.displayName || handleToNickName(userProfile?.handle),
    }
  }, {
    ready: !!userProfile?.did
  })

  useEffect(() => {
    if (!hasLoggedIn) {
      router.replace('/')
    }
  }, []);

  if (!hasLoggedIn) {
    return null
  }

  return <LayoutCenter>
    <div className={S.container}>
      <CardWindow
        noInnerWrap
        headerExtra={<BreadCrumbs
          className={S.breadCrumb}
          breads={[{
            title: '论坛首页',
            route: '/posts'
          }, {
            title: '个人中心'
          }]}
        />}
      >
        <div className={S.wrap}>
          <div className={S.left}>
            <UserInfo
              userProfile={userInfo}
              isMe
            />
          </div>
          <div className={S.right}>
            <BBSDataSelf
              postsCount={userInfo?.post_count}
              replyCount={userInfo?.reply_count}
            />
          </div>
        </div>
      </CardWindow>

      <DataDetail
        did={userProfile?.did}
        profile={userInfo}
      />
    </div>
  </LayoutCenter>
}

export default Page;