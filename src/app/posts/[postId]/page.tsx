import S from './index.module.scss'
import PostDetail from "@/app/posts/[postId]/PostDetail";
import BreadCrumbs from "@/components/BreadCrumbs";
import { getPostUriHref } from "@/lib/postUriHref";
import { LayoutCenter } from "@/components/Layout";
import Post404Auth from "@/app/posts/[postId]/_components/Post404Auth";

export default async function PostDetailPage({ params } : { params: Promise<{ postId: string }> }) {
  const { postId } = await params
  const decodeId = getPostUriHref(postId)

  return <LayoutCenter>
    <Post404Auth postId={decodeId} fetchSection>
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
    </Post404Auth>
  </LayoutCenter>
}