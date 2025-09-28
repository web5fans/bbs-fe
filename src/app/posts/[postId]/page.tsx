'use client'

import S from './index.module.scss'
import PostDetail from "@/app/posts/[postId]/PostDetail";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useParams } from "next/navigation";
import { getPostUriHref } from "@/lib/postUriHref";
import { LayoutCenter } from "@/components/Layout";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>()


  const decodeId = getPostUriHref(postId)

  return <LayoutCenter>
    <PostDetail
      postId={decodeId}
      breadCrumb={<BreadCrumbs
        className={S.breadCrumb}
        breads={[{
          title: '首页',
          route: '/posts'
        }, {
          title: '帖子详情'
        }]}
      />}
    />
  </LayoutCenter>
}