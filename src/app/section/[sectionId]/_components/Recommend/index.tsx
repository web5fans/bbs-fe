'use client'

import S from './index.module.scss'
import { NoticeCardItem } from "@/app/posts/_components/NoticeBoard";
import { useRequest } from "ahooks";
import server from "@/server";
import { PostFeedItemType } from "@/app/posts/utils";
import { useRouter } from "next/navigation";

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

  const router = useRouter()

  if (!list || list.length === 0) {
    return null
  }

  return <div className={S.recommend}>
    <p className={S.recommendTitle}>推荐讨论</p>
    <div className={S.recommendContent} style={list?.length > 2 ? { paddingBottom: 20 } : {}}>
      {list?.map(p => {
        return <NoticeCardItem
          noticeInfo={p}
          key={p.uri}
          onClick={() => router.push(`/section/${sectionId}/` + encodeURIComponent(p.uri))}
        />
      })}
    </div>
  </div>
}

export default Recommend;