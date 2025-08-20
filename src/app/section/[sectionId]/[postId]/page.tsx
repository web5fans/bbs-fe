'use client'

import S from "./index.module.scss";
import PostDetail from "@/app/posts/[postId]/PostDetail";
import BreadCrumbs from "@/components/BreadCrumbs";
import server from "@/server";
import { SectionItem } from "@/app/posts/utils";
import { useParams } from "next/navigation";
import { useRequest } from "ahooks";
import FloatingMark, { useFloatingMarkDistance } from "@/components/FloatingMark";
import Button from "@/components/Button";
import { CommentIcon } from "@/app/posts/[postId]/page";
import cx from "classnames";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function SectionPostPage(){
  const { postId, sectionId } = useParams<{ postId: string; sectionId: string }>()

  const { hasLoggedIn } = useCurrentUser()

  const { data: sectionInfo } = useRequest(async () => {
    return await server<SectionItem>('/section/detail', 'GET', {
      id: sectionId
    })
  }, {
    ready: !!sectionId
  })

  const { rootRef, stickyRef } = useFloatingMarkDistance()


  const decodeId = decodeURIComponent(postId)

  return <div className={S.container}>
    <div className={S.inner} ref={rootRef}>
      <PostDetail
        sectionId={sectionId}
        postId={decodeId}
        breadCrumb={<BreadCrumbs
          className={S.breadCrumb}
          breads={[{
            title: '首页',
            route: '/posts'
          }, {
            title: sectionInfo?.name || '',
            route: `/section/${sectionId}`
          }, {
            title: '帖子详情'
          }]}
        />}
      />
      <FloatingMark ref={stickyRef}>
        <Button
          type={'primary'}
          className={cx(S.comment, !hasLoggedIn && '!hidden')}
          onClick={() => {
            document.getElementById('comment_post')?.scrollIntoView({ behavior: "smooth" });
          }}
        ><CommentIcon /></Button>
      </FloatingMark>
    </div>
  </div>
}