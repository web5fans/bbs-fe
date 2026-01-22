'use client'

import S from "./index.module.scss";
import PostDetail from "@/app/posts/[postId]/PostDetail";
import BreadCrumbs from "@/components/BreadCrumbs";
import server from "@/server";
import { SectionItem } from "@/app/posts/utils";
import { useParams } from "next/navigation";
import { useRequest } from "ahooks";
import { getPostUriHref } from "@/lib/postUriHref";
import { LayoutCenter } from "@/components/Layout";
import Post404Auth from "@/app/posts/[postId]/_components/Post404Auth";

export default function SectionPostPage(){
  const { postId, sectionId } = useParams<{ postId: string; sectionId: string }>()

  const { data: sectionInfo } = useRequest(async () => {
    return await server<SectionItem>('/section/detail', 'GET', {
      id: sectionId
    })
  }, {
    ready: !!sectionId
  })

  const decodeId = getPostUriHref(postId)

  return <LayoutCenter>
    <Post404Auth postId={decodeId} section={sectionInfo}>
      <PostDetail
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
    </Post404Auth>
  </LayoutCenter>
}