'use client'

import { useInfiniteScroll } from "ahooks";
import server from "@/server";
import { PostFeedType } from "@/app/posts/_components/PostsList";
import PostFeedItem from "@/components/PostFeedItem";
import LoadMoreView from "@/components/LoadMoreView";
import { EmptyPostsList, EmptyText } from "@/components/Empty";
import { JSX } from "react";
import { useRouter } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";
import { postUriToHref } from "@/lib/postUriHref";

type UserPostsPropsType = {
  did: string
  emptyRender?: () => JSX.Element
}

const UserPosts = (props: UserPostsPropsType) => {
  const { did } = props;

  const router = useRouter();

  const { userProfile } = useCurrentUser()

  const isMe = did === userProfile?.did

  const { data: dataSource, loading, loadingMore, loadMore, noMore, reload } = useInfiniteScroll<ISPageData>(async (prevData) => {

    const { nextCursor } = prevData || {};

    const pagedData = await server<PostFeedType>('/post/list', 'POST', {
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

  if (dataSource?.list && dataSource?.list.length === 0) {
    if (isMe) {
      return <EmptyPostsList
        goPublish={() => router.push('/posts/publish')}
        className={'!h-[440px]'}
        message={'暂无帖子，快去发帖讨论吧！'}
      />
    }
    return <EmptyText className={'!h-[440px]'} message={'此人的帖子正在酝酿中...'} />
  }

  return <div>
    {dataSource?.list.map((item, index) => {
      const uri = postUriToHref(item.uri)
      const href = `/posts/${uri}`
      return <PostFeedItem
        feed={item}
        key={item.uri}
        onClick={() => router.push(href)}
        onHover={() => router.prefetch(href)}
      />
    })}
    {!loading && !noMore && <LoadMoreView onLoadMore={loadMore} />}
  </div>
}

export default UserPosts;