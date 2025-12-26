import S from "./index.module.scss";
import { useEffect, useMemo, useRef } from "react";
import TextHoverFocus from "@/components/TextHoverFocus";
import Link from "next/link";
import { EmptyText } from "@/components/Empty";
import MessageItem from "@/app/notification/_components/MessageItem";
import { useBoolean, useInfiniteScroll } from "ahooks";
import server from "@/server";
import useCurrentUser from "@/hooks/useCurrentUser";
import { CircleLoading } from "@/components/Loading";
import { NotifyItemType } from "@types/notification";
import useNotify from "@/store/notification";

type NotificationPopOverProps = {
  position: {
    top?: number
  }
  onClose: () => void
}

const NotificationPopOver = (props: NotificationPopOverProps) => {
  const { userProfile } = useCurrentUser()

  const scrollRef = useRef<HTMLDivElement>(null);

  const [isReadAll, { setTrue: setReadAll }] = useBoolean(false)

  const { data: notifyInfo, loading, loadingMore, loadMore, noMore, reload, mutate } = useInfiniteScroll(async (prevData) => {

    const pagedData = await server<{notifies: NotifyItemType[], cursor?: string}>('/notify/list', 'POST', {
      n_type: [],
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
    target: scrollRef,
    isNoMore: d => !d?.nextCursor,
    reloadDeps: [userProfile?.did]
  });

  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const { top } = props.position
    if (!popoverRef.current || !top) return

    popoverRef.current.style.top = `${top - 2}px`;

  }, [props.position]);

  const readAll = async () => {
    await server('/notify/read', 'POST', {
      repo: userProfile?.did,
      target: null
    })
    useNotify.getState().updateUnReadNum()
    setReadAll()
  }

  const contentRender = useMemo(() => {
    if (loading) {
      return <div className={'h-full flex items-center justify-center'}>
        <CircleLoading />
      </div>
    }
    if (!notifyInfo || notifyInfo?.list?.length === 0) {
      return <EmptyText message={'暂无消息，快去浏览帖子互动吧！'} className={'!h-full'} />
    }
    return notifyInfo?.list?.map((item, index) => <div onClick={props.onClose}>
      <MessageItem key={item.id} notify={item} isReadAll={isReadAll} />
    </div>)
  }, [loading, notifyInfo, isReadAll])

  return <div ref={popoverRef} className={S.popover}>
    <p className={S.header}>
      <span className={S.title}>消息通知</span>
      <a className={S.readAll} onClick={readAll}>全部已读</a>
    </p>
    <div className={S.content} ref={scrollRef}>
      {contentRender}
    </div>
    <Link href={'/notification'} prefetch className={'flex items-center justify-center'}>
      <TextHoverFocus text={'查看全部'} classnames={{ wrap: S.checkAll }} />
    </Link>
  </div>
}

export default NotificationPopOver;