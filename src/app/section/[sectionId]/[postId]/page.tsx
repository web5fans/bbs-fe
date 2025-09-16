'use client'

import S from "./index.module.scss";
import PostDetail from "@/app/posts/[postId]/PostDetail";
import BreadCrumbs from "@/components/BreadCrumbs";
import server from "@/server";
import { SectionItem } from "@/app/posts/utils";
import { useParams } from "next/navigation";
import { useRequest } from "ahooks";
import { useFloatingMarkDistance } from "@/components/FloatingMark";
import { PostsFixedMark } from "@/app/posts/[postId]/page";
import useCurrentUser from "@/hooks/useCurrentUser";
import { getPostUriHref } from "@/lib/postUriHref";
import { LayoutCenter } from "@/components/Layout";
import { useRef } from "react";

export default function SectionPostPage(){
  const { postId, sectionId } = useParams<{ postId: string; sectionId: string }>()

  const { isWhiteUser } = useCurrentUser()

  const { data: sectionInfo } = useRequest(async () => {
    return await server<SectionItem>('/section/detail', 'GET', {
      id: sectionId
    })
  }, {
    ready: !!sectionId
  })

  const { rootRef, stickyRef } = useFloatingMarkDistance()


  const decodeId = getPostUriHref(postId)

  const detailRef = useRef<{ commentRootPostRecord: any } | null>(null)

  return <LayoutCenter>
    <div className={S.container}>
      <div
        className={S.inner}
        ref={rootRef}
      >
        <PostDetail
          componentRef={detailRef}
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
        <PostsFixedMark detailRef={detailRef} stickyRef={stickyRef} isWhiteUser={isWhiteUser} />
      </div>
    </div>
  </LayoutCenter>
}