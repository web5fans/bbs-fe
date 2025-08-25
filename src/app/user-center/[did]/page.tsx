'use client'

import { useRequest } from "ahooks";
import server from "@/server";
import { UserProfileType } from "@/store/userInfo";
import S from "@/app/user-center/index.module.scss";
import CardWindow from "@/components/CardWindow";
import BreadCrumbs from "@/components/BreadCrumbs";
import UserInfo from "@/app/user-center/components/UserInfo";
import DataDetail from "@/app/user-center/components/DataDetail";
import { useParams, useRouter } from "next/navigation";
import BBSDataOther from "@/app/user-center/components/BBSDataOther";

const UserProfilePage = () => {
  const { did } = useParams<{ did: string }>()
  const decodeDid = decodeURIComponent(did)

  const router = useRouter();

  const { data: userInfo } = useRequest(async () => {
    return await server<UserProfileType>('/repo/profile', 'GET', {
      repo: decodeDid
    })
  }, {
    ready: !!decodeDid
  })

  return <div className={S.container}>
    <CardWindow
      noInnerWrap
      headerExtra={<BreadCrumbs
        className={S.breadCrumb}
        breads={[{
          title: '帖子详情',
          onClick: () => router.back()
        }, {
          title: userInfo?.displayName
        }]}
      />}>
      <div className={S.wrap}>
        <div className={S.left}>
          <UserInfo userProfile={userInfo} />
        </div>
        <div className={S.right}>
          <BBSDataOther postsCount={userInfo?.post_count} replyCount={userInfo?.reply_count} />
        </div>
      </div>
    </CardWindow>

    <DataDetail did={userInfo?.did} profile={userInfo} />
  </div>
}

export default UserProfilePage;