'use client'

import S from './index.module.scss'
import { useInfiniteScroll } from 'ahooks'
import ArrowSDown from '@/assets/arrow-s.svg'
import { useEffect, useRef, useState } from "react";
import cx from "classnames";
import Avatar from "@/components/Avatar";
import server from "@/server";
import FeedStatistic from "@/components/FeedStatistic";
import { handleToNickName } from "@/lib/handleToNickName";
import LoadMoreView from "@/components/LoadMoreView";
import { useRouter } from "next/navigation";
import { PostFeedItemType } from "@/app/posts/utils";
import utcToLocal from "@/lib/utcToLocal";

const PAGE_SIZE = 20

type ISPageData = {
  list: PostFeedItemType[],
  nextCursor?: string
}

export type PostFeedType = {
  cursor?: string
  posts: PostFeedItemType[]
}

const PostsList = ({ sectionId }: {
  sectionId?: string
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

  return <div className={S.wrap}>
    <p className={S.title}>最新帖子</p>
    <div className={cx(S.content, clickedShowMore && '!max-h-none')}>
      {dataSource?.list.map((item, index) => <FeedItem
        key={item.uri}
        feed={item}
        onClick={() => {
          const uri = encodeURIComponent(item.uri)
          let href = `/posts/${uri}`
          if (sectionId) {
            href = `/section/${sectionId}/${uri}`
          }
          router.push(href)
        }}
      />)}


      {!clickedShowMore && (dataSource?.list.length || 0) > 6 &&<div
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

function FeedItem({ feed, onClick }: {
  feed: PostFeedItemType;
  onClick: () => void
}) {
  const { author } = feed;

  const [innerRichText, setInnerRichText] = useState('')
  const contentRef = useRef<HTMLDivElement>(null);

  const nickname = handleToNickName(author.displayName);

  const title = feed.title

  const html = feed.text

  useEffect(() => {
    const text = contentRef.current?.innerText
    setInnerRichText(text)
  }, []);

  return <div
    className={S.feed}
    onClick={onClick}
  >
    <p className={S.header}>
      {title}
    </p>
    
    <div
      ref={contentRef}
      className={'h-0 overflow-hidden'}
      dangerouslySetInnerHTML={{ __html: html }}
    />

    <p className={S.feedInfo}>{innerRichText}</p>

    <div className={S.footer}>
      <div className={S.left}>
        <div className={S.nickname}>
          <Avatar className={S.avatar} nickname={nickname} />
          {nickname}
        </div>
        <span>{feed.section}</span>
        <FeedStatistic />
      </div>
      <span className={S.time}>{utcToLocal(feed.created)}</span>
    </div>
  </div>
}