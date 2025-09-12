import S from './index.module.scss'
import { useBoolean, useInfiniteScroll } from "ahooks";
import server from "@/server";
import JSONToHtml from "@/components/TipTapEditor/components/json-to-html/JSONToHtml";
import PostLike from "@/app/posts/[postId]/_components/PostLike";
import utcToLocal from "@/lib/utcToLocal";
import useCurrentUser from "@/hooks/useCurrentUser";
import { usePostCommentReply } from "@/provider/PostReplyProvider";
import SmallAvatar from "@/components/Avatar/SmallAvatar";
import { useEffect, useRef, useState } from "react";
import cx from "classnames";
import ArrowIcon from '@/assets/arrow-s.svg';

const ReplyList = (props: {
  uri: string
  rootUri: string
  sectionId: string
  total: string
}) => {
  const { userProfile } = useCurrentUser()

  const { openModal } = usePostCommentReply()

  const { data: replyListInfo, loading, loadingMore, loadMore, noMore, reload } = useInfiniteScroll(async (prevData) => {

    const { nextCursor } = prevData || {};

    const pagedData = await server('/reply/list', 'POST', {
      comment: props.uri,
      limit: 5,
      cursor: nextCursor,
      viewer: userProfile?.did
    })

    const { replies, cursor } = pagedData || {};

    return {
      list: replies ?? [],
      nextCursor: cursor,
    };
  }, {
    isNoMore: d => !d?.nextCursor,
    reloadDeps: [userProfile?.did]
  });

  const reply = (info: any) => {
    openModal({
      type: 'reply',
      postUri: props.rootUri,
      commentUri: props.uri,
      toUserName: info.author.displayName,
      sectionId: props.sectionId,
      toDid: info.author.did,
      refresh: reload
    })
  }

  return <div className={S.wrap}>
    {replyListInfo?.list.map(info => {
      return <ReplyItem
        replyItem={info}
        sectionId={props.sectionId}
        key={info.uri}
        toReply={() => reply(info)}
      />
    })}
    {props.total > 5 && !noMore && <div
      className={S.load}
      onClick={loadMore}
    ><ArrowIcon />加载更多</div>}
  </div>
}

export default ReplyList;

function ReplyItem(props: {
  replyItem: any
  sectionId: string
  toReply: () => void
}) {
  const { replyItem, sectionId } = props;

  return <div className={S.replyItem}>
    <div className={S.title}>
      <div className={S.avatar}>
        <SmallAvatar nickname={replyItem.author.displayName} />
      </div>
      <span className={'font-medium'}>{replyItem.author.displayName}</span>
      {
        !!replyItem.to?.displayName &&  <>&nbsp;回复&nbsp;<span className={'font-medium'}>{replyItem.to?.displayName}</span></>
      }
    </div>
    <HtmlContent html={replyItem.text} />
    <div className={S.footer}>
      <PostLike
        liked={replyItem.liked}
        likeCount={replyItem.like_count}
        uri={replyItem.uri}
        sectionId={sectionId}
      />
      <span className={S.reply} onClick={props.toReply}>回复</span>
      <span>{utcToLocal(replyItem.created, 'YYYY/MM/DD HH:mm:ss')}</span>
    </div>
  </div>
}

function HtmlContent(props: {html: string}) {
  const [showDetailVis, setShowDetailVis] = useState(false)
  const [expand, { toggle }] = useBoolean(false)

  const htmlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!htmlRef.current) return

    const observer = new ResizeObserver(() => {
      if (!htmlRef.current) return
      const scrollHeight = htmlRef.current.scrollHeight
      const clientHeight = htmlRef.current.clientHeight
      if (scrollHeight > clientHeight) {
        setShowDetailVis(true)
      }
    })
    observer.observe(htmlRef.current)

    return () => {
      if (!htmlRef.current) return
      observer.unobserve(htmlRef.current)
    }
  }, []);

  return <>
    <div
      className={cx(S.content, expand ? '!max-h-none' : '')}
      ref={htmlRef}
    >
      <JSONToHtml html={props.html} />
    </div>
    {showDetailVis && <p
      className={S.showDetail}
      onClick={toggle}
    >{expand ? <span className={S.packup}>收起</span> : '展开详情'}</p>}
  </>
}