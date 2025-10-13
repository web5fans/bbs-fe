'use client'

import S from './index.module.scss'
import { NoticeCardItem } from "@/app/posts/_components/NoticeBoard";
import { useRequest } from "ahooks";
import server from "@/server";
import { PostFeedItemType } from "@/app/posts/utils";
import { useRouter } from "next/navigation";
import cx from "classnames";
import { postUriToHref } from "@/lib/postUriHref";
import { Ref, useImperativeHandle } from "react";

const Recommend = ({ sectionId, ref }: { sectionId: string; ref?: Ref<{ reload: () => void }> }) => {
  const { data: list, refresh } = useRequest(async () => {
    const result = await server<{ posts: PostFeedItemType[] }>('/post/list', 'POST', {
      limit: 10,
      section_id: sectionId,
      is_announcement: true,
    })

    return result.posts || []
  }, {
    ready: !!sectionId,
    refreshDeps: [sectionId]
  })

  const router = useRouter()

  useImperativeHandle(ref, () => {
    return {
      reload: refresh
    }
  })

  if (!list || list.length === 0) {
    return null
  }

  const hasMoreCard = list?.length > 2

  return <div className={cx(S.recommend, hasMoreCard && S.moreCard)}>
    <p className={S.recommendTitle}>推荐讨论</p>
    <div className={S.recommendContent}>
      {list?.map(p => {
        return <NoticeCardItem
          noticeInfo={p}
          key={p.uri}
          onClick={() => router.push(`/section/${sectionId}/` + postUriToHref(p.uri))}
        />
      })}
    </div>
  </div>
}

export default Recommend;