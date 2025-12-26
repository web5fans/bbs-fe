'use client'

import S from './index.module.scss'
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRef } from "react";
import { useInfiniteScroll } from "ahooks";
import server from "@/server";
import { NOTIFY_TYPE_ENUM, NotifyItemType } from "@types/notification";
import { CircleLoading } from "@/components/Loading";
import { EmptyText } from "@/components/Empty";
import MessageItem from "@/app/notification/_components/MessageItem";
import cx from "classnames";
import LoadMoreView from "@/components/LoadMoreView";

const MessageList = ({ types, isReadAll }: { types: NOTIFY_TYPE_ENUM[] | null; isReadAll?: boolean }) => {
  const { userProfile } = useCurrentUser()

  const { data: notifyInfo, loading, loadingMore, loadMore, noMore, reload } = useInfiniteScroll(async (prevData) => {

    const pagedData = await server<{notifies: NotifyItemType[], cursor?: string}>('/notify/list', 'POST', {
      n_type: types,
      limit: 10,
      cursor: prevData?.nextCursor,
      repo: userProfile?.did
    })

    const { notifies, cursor } = pagedData || {};

    return {
      list: notifies ?? [],
      nextCursor: cursor,
    };
  }, {
    isNoMore: d => !d?.nextCursor,
    reloadDeps: [userProfile?.did]
  });

  if (loading) {
    return <div className={cx(S.minHeight, 'h-full flex items-center justify-center')}>
      <CircleLoading />
    </div>
  }

  if (!notifyInfo || notifyInfo?.list?.length === 0) {
    return <EmptyText message={'暂无消息，快去浏览帖子互动吧！'} className={S.minHeight} />
  }

  return <div>
    {
      notifyInfo?.list?.map((item, index) => <MessageItem key={item.id} notify={item} isReadAll={isReadAll} />)
    }
    {!loading && !noMore && <LoadMoreView onLoadMore={loadMore} />}
  </div>
}

export default MessageList;