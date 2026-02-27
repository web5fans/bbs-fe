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
import MouseToolTip from "@/components/MouseToolTip";
import useCurrentUser from "@/hooks/useCurrentUser";
import remResponsive from "@/lib/rem-responsive";
import { Loading } from "@/components/Loading";

type UserCommentsPropsType = {
  did: string
  emptyRender?: () => JSX.Element
  commentName: string
  scrollToTop?: () => void
}

const UserComments = (props: UserCommentsPropsType) => {
  const { did, commentName } = props;

  const router = useRouter();
  const { userProfile } = useCurrentUser()

  const { data: dataSource, loading, loadingMore, loadMore, noMore, reload } = useInfiniteScroll(async (prevData) => {

    const { nextCursor } = prevData || {};

    const pagedData = await server<PostFeedType>('/post/commented', 'POST', {
      limit: 20,
      cursor: nextCursor,
      repo: did,
      viewer: userProfile?.did
    })

    const { posts, cursor } = pagedData || {};

    return {
      list: posts ?? [],
      nextCursor: cursor
    };
  }, {
    reloadDeps: [did, userProfile?.did],
    isNoMore: d => !d?.nextCursor,
  });

  useEffect(() => {
    if (!loading) {
      props.scrollToTop?.()
    }
  }, [loading]);

  if (loading) {
    return <Loading style={{ minHeight: remResponsive(250) }} />
  }

  if (dataSource?.list && dataSource?.list.length === 0) {
    return <EmptyText className={S.empty} message={'此人的帖子正在酝酿中...'} />
  }

  return <div>
    {dataSource?.list.map((item, index) => {
      const uri = postUriToHref(item.uri)
      const href = `/posts/${uri}`
      return <MouseToolTip
        open={!!item.comment_disabled}
        message={'该帖子已被管理员或版主取消公开，原因：'+item.comment_reasons_for_disabled}
        className={S.commentItem}
      >
        <CommentPostItem
          disabled={item.comment_disabled}
          feed={item}
          key={item.uri}
          onClick={() => router.push(href)}
          onHover={() => router.prefetch(href)}
          nickname={commentName}
        />
      </MouseToolTip>
    })}
    {!loading && !noMore && <LoadMoreView onLoadMore={loadMore} />}
  </div>
}

export default UserComments;