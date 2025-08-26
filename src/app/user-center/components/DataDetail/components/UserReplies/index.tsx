'use client'

import { useInfiniteScroll } from "ahooks";
import server from "@/server";
import { PostFeedType } from "@/app/posts/_components/PostsList";
import LoadMoreView from "@/components/LoadMoreView";
import { EmptyPostsList, EmptyText } from "@/components/Empty";
import { JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReplyPostItem from "../ReplyPostItem";
import { postUriToHref } from "@/lib/postUriHref";

type UserRepliesPropsType = {
  did: string
  emptyRender?: () => JSX.Element
  replyName: string
  scrollToTop?: () => void
}

const UserReplies = (props: UserRepliesPropsType) => {
  const { did, replyName } = props;

  const router = useRouter();

  const { data: dataSource, loading, loadingMore, loadMore, noMore, reload } = useInfiniteScroll<ISPageData>(async (prevData) => {

    const { nextCursor } = prevData || {};

    const pagedData = await server<PostFeedType>('/post/replied', 'POST', {
      limit: 20,
      cursor: nextCursor,
      repo: did
    })

    const { posts, cursor } = pagedData || {};

    return {
      list: posts ?? [],
      nextCursor: cursor
    };
  }, {
    reloadDeps: [did],
    isNoMore: d => !d?.nextCursor,
  });

  useEffect(() => {
    if (!loading) {
      props.scrollToTop?.()
    }
  }, [loading]);

  if (dataSource?.list && dataSource?.list.length === 0) {
    return <EmptyText className={'!h-[440px]'} message={'此人的帖子正在酝酿中...'} />
  }

  return <div>
    {dataSource?.list.map((item, index) => {
      const uri = postUriToHref(item.uri)
      const href = `/posts/${uri}`
      return <ReplyPostItem
        feed={item}
        key={item.uri}
        onClick={() => router.push(href)}
        onHover={() => router.prefetch(href)}
        nickname={replyName}
      />
    })}
    {!loading && !noMore && <LoadMoreView onLoadMore={loadMore} />}
  </div>
}

export default UserReplies;