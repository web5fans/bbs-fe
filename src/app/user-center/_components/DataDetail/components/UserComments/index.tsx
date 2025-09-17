'use client'

import { useInfiniteScroll } from "ahooks";
import server from "@/server";
import { PostFeedType } from "@/app/posts/_components/PostsList";
import LoadMoreView from "@/components/LoadMoreView";
import { EmptyPostsList, EmptyText } from "@/components/Empty";
import { JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
import CommentPostItem from "../CommentPostItem";
import { postUriToHref } from "@/lib/postUriHref";
import S from './index.module.scss'

type UserCommentsPropsType = {
  did: string
  emptyRender?: () => JSX.Element
  commentName: string
  scrollToTop?: () => void
}

const UserComments = (props: UserCommentsPropsType) => {
  const { did, commentName } = props;

  const router = useRouter();

  const { data: dataSource, loading, loadingMore, loadMore, noMore, reload } = useInfiniteScroll<ISPageData>(async (prevData) => {

    const { nextCursor } = prevData || {};

    const pagedData = await server<PostFeedType>('/post/commented', 'POST', {
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
    return <EmptyText className={S.empty} message={'此人的帖子正在酝酿中...'} />
  }

  return <div>
    {dataSource?.list.map((item, index) => {
      const uri = postUriToHref(item.uri)
      const href = `/posts/${uri}`
      return <CommentPostItem
        feed={item}
        key={item.uri}
        onClick={() => router.push(href)}
        onHover={() => router.prefetch(href)}
        nickname={commentName}
      />
    })}
    {!loading && !noMore && <LoadMoreView onLoadMore={loadMore} />}
  </div>
}

export default UserComments;