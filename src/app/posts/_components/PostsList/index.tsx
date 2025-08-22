'use client'

import S from './index.module.scss'
import { useInfiniteScroll } from 'ahooks'
import ArrowSDown from '@/assets/arrow-s.svg'
import { useState } from "react";
import cx from "classnames";
import server from "@/server";
import LoadMoreView from "@/components/LoadMoreView";
import { useRouter } from "next/navigation";
import { PostFeedItemType } from "@/app/posts/utils";
import PostFeedItem from "@/components/PostFeedItem";

const PAGE_SIZE = 20

type ISPageData = {
  list: PostFeedItemType[],
  nextCursor?: string
}

export type PostFeedType = {
  cursor?: string
  posts: PostFeedItemType[]
}

const PostsList = ({ sectionId, minLimit = 20, listEmptyRender }: {
  sectionId?: string
  minLimit?: number
  listEmptyRender?: React.ReactNode
}) => {
  const router = useRouter()

  const [clickedShowMore, setClickedShowMore] = useState(false)
  const { data: dataSource, loading, loadingMore, loadMore, noMore, reload } = useInfiniteScroll<ISPageData>(async (prevData) => {

    const { nextCursor } = prevData || {};

    const pagedData = await server<PostFeedType>('/post/list', 'POST', {
      limit: PAGE_SIZE,
      cursor: nextCursor,
      section_id: sectionId
    })

    const { posts, cursor } = pagedData || {};

    return {
      list: posts ?? [],
      nextCursor: cursor
    };
  }, {
    reloadDeps: [sectionId],
    isNoMore: d => !d?.nextCursor,
  });

  const showClickLoadMore = !clickedShowMore && (dataSource?.list.length || 0) > minLimit

  const showList = showClickLoadMore ? dataSource?.list.slice(0, minLimit) : dataSource?.list

  if (dataSource?.list.length === 0 && listEmptyRender) {
    return <div className={S.wrap}>
      <p className={S.title}>最新帖子</p>
      <div className={cx(S.content)}>
        {listEmptyRender}
      </div>
    </div>
  }

  return <div className={S.wrap}>
    <p className={S.title}>最新帖子</p>
    <div className={cx(S.content)}>
      {showList?.map((item, index) => {
        const uri = encodeURIComponent(item.uri)
        let href = `/posts/${uri}`
        if (sectionId) {
          href = `/section/${sectionId}/${uri}`
        }

        return <PostFeedItem
          feed={item}
          key={item.uri}
          onClick={() => router.push(href)}
          onHover={() => router.prefetch(href)}
        />
      })}


      {showClickLoadMore &&<div
        className={S.load}
        onClick={() => setClickedShowMore(true)}
      >
        <ArrowSDown />
        加载更多
      </div>}

      {
        clickedShowMore && !loading && !noMore && (
          <LoadMoreView onLoadMore={loadMore} />
        )
      }
    </div>
  </div>
}

export default PostsList;