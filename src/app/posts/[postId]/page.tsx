import S from './index.module.scss'
import PostDetail from "@/app/posts/[postId]/PostDetail";
import BreadCrumbs from "@/components/BreadCrumbs";

export default async function PostDetailPage({
 params,
}: {
  params: Promise<{ postId: string }>
}) {
  const { postId } = await params

  const decodeId = decodeURIComponent(postId)

  return <div className={S.container}>
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
  </div>
}