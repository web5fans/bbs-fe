'use client'

import { useInfiniteScroll } from "ahooks";
import server from "@/server";
import { PostFeedType } from "@/app/posts/_components/PostsList";
import PostFeedItem from "@/components/PostFeedItem";
import LoadMoreView from "@/components/LoadMoreView";
import { EmptyPostsList, EmptyText } from "@/components/Empty";
import { JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";
import { postUriToHref } from "@/lib/postUriHref";
import S from './index.module.scss'
import MouseToolTip from "@/components/MouseToolTip";
import { Loading } from "@/components/Loading";
import remResponsive from "@/lib/rem-responsive";

type UserPostsPropsType = {
  did: string
  emptyRender?: () => JSX.Element
  scrollToTop?: () => void
}

const UserPosts = (props: UserPostsPropsType) => {
  const { did } = props;

  const router = useRouter();

  const { userProfile } = useCurrentUser()

  const isMe = did === userProfile?.did

  const { data: dataSource, loading, loadingMore, loadMore, noMore, reload } = useInfiniteScroll<ISPageData>(async (prevData) => {

    const { nextCursor } = prevData || {};

    if (!did) {
      return
    }

    const pagedData = await server<PostFeedType>('/post/list', 'POST', {
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
    if (isMe) {
      return <EmptyPostsList
        goPublish={() => router.push('/posts/publish')}
        className={S.empty}
        message={'暂无帖子，快去发帖讨论吧！'}
      />
    }
    return <EmptyText className={S.empty} message={'此人的帖子正在酝酿中...'} />
  }

  return <div>
    {dataSource?.list.map((item, index) => {
      const uri = postUriToHref(item.uri)
      const href = `/posts/${uri}`
      return <MouseToolTip
        open={!!item.is_disabled}
        message={'该帖子已被管理员或版主取消公开，原因：'+item.reasons_for_disabled}
        className={S.feedItem}>
        <PostFeedItem
          disabled={item.is_disabled}
          feed={item}
          key={item.uri}
          onClick={() => router.push(href)}
          onHover={() => router.prefetch(href)}
        />
      </MouseToolTip>
    })}
    {!loading && !noMore && <LoadMoreView onLoadMore={loadMore} />}
  </div>
}

export default UserPosts;