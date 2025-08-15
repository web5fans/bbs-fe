import S from "./index.module.scss";
import PostDetail from "@/app/posts/[postId]/PostDetail";
import BreadCrumbs from "@/components/BreadCrumbs";
import server from "@/server";
import { SectionItem } from "@/app/posts/utils";

export default async function SectionPostPage({
  params,
}: {
  params: Promise<{ postId: string; sectionId: string }>
}){
  const { postId, sectionId } = await params
  const sectionInfo = await server<SectionItem>('/section/detail', 'GET', {
    id: sectionId
  })

  const decodeId = decodeURIComponent(postId)

  return <div className={S.container}>
    <div className={S.inner}>
      <PostDetail
        sectionId={sectionId}
        postId={decodeId}
        breadCrumb={<BreadCrumbs
          className={S.breadCrumb}
          breads={[{
            title: '首页',
            route: '/posts'
          }, {
            title: sectionInfo.name,
            route: `/section/${sectionId}`
          }, {
            title: '帖子详情'
          }]}
        />}
      />
    </div>
  </div>
}