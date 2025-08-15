'use client'

import S from './index.module.scss'
import { NoticeCardItem } from "@/app/posts/_components/NoticeBoard";
import { useRequest } from "ahooks";
import server from "@/server";
import { PostFeedItemType } from "@/app/posts/utils";

const Recommend = ({ sectionId }: { sectionId: string }) => {
  const { data: list } = useRequest(async () => {
    const result = await server<{ posts: PostFeedItemType[] }>('/post/top', 'POST', {
      section_id: sectionId,
    })
    return result.posts || []
  }, {
    ready: !!sectionId,
    refreshDeps: [sectionId]
  })

  return <div className={S.recommend}>
    <p className={S.recommendTitle}>推荐讨论</p>
    <div className={S.recommendContent}>
      {list?.map(p => {
        return <NoticeCardItem noticeInfo={p} />
      })}
    </div>
  </div>
}

export default Recommend;