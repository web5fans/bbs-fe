import S from './index.module.scss'
import PostLike from "@/app/posts/[postId]/_components/PostLike";
import { CSSProperties, useEffect, useRef, useState } from "react";
import LikeList, { LikeListRef } from "@/app/posts/[postId]/_components/PostItem/_components/LikeList";
import { usePostCommentReply } from "@/provider/PostReplyProvider";
import TabWrap from "@/app/posts/[postId]/_components/PostItem/_components/TabWrap";
import ReplyList, { ReplyListRefProps } from "@/app/posts/[postId]/_components/PostItem/_components/ReplyList";
import utcToLocal from "@/lib/utcToLocal";

function formatDate(date: string) {
  return utcToLocal(date, 'YYYY/MM/DD HH:mm:ss')
}

const PostItemFooter = (props: {
  postInfo: any
  sectionId: string
  floor: number
  rootUri: string
  refresh?: () => void
}) => {
  const { postInfo, sectionId, floor, rootUri } = props
  const [ showType, setShowType ] = useState<'like' | 'reply' | undefined>(undefined)
  const [replyTotal, setReplyTotal] = useState('0')

  const likeListRef = useRef<LikeListRef>(null)
  const replyListRef = useRef<ReplyListRefProps>(null)

  const parentRef = useRef<HTMLDivElement>(null)

  const [arrowPos, setArrowPos] = useState<{ left: string } | undefined>(undefined)

  const { openModal } = usePostCommentReply()

  const reply = () => {
    // const clientWidth = parentRef.current.clientWidth
    // const offsetLeft = parentRef.current.offsetLeft

    if (!postInfo.reply_count || postInfo.reply_count === '0') {

      // const shouldRect = window.innerWidth >= 1023
      //
      // openReplyModal(shouldRect ? {
      //   width: clientWidth,
      //   left: offsetLeft,
      //   transform: 'none'
      // }: undefined)
      openReplyModal()
      return;
    }
    if (showType === 'reply') {
      setShowType(undefined);
      return
    }
    setShowType('reply')
  }

  const openReplyModal = (obj?: CSSProperties) => {
    openModal({
      type: 'reply',
      postUri: rootUri,
      commentUri: postInfo.uri,
      toUserName: postInfo.author.displayName,
      sectionId,
      refresh: () => {
        props.refresh?.()
        replyListRef.current?.reload()
      },
      rect: obj
    })
  }

  const showLikeList = () => {
    if (showType === 'like') {
      setShowType(undefined);
      return
    }
    setShowType("like")
  }

  useEffect(() => {
    setReplyTotal(postInfo.reply_count || '0')
  }, [postInfo.reply_count]);

  const noMainPost = rootUri !== postInfo.uri

  return <>
    <div
      className={S.floor}
      ref={parentRef}
      onClick={e => {
        const target = e.target as HTMLDivElement
        const paddingRight = getComputedStyle(target).paddingRight.replace('px', '')
        const paddingleft = getComputedStyle(target).paddingLeft.replace('px', '')
        const width = (target.clientWidth - paddingRight - paddingleft) / 2
        setArrowPos({ left: (target.offsetLeft + width - 1) + 'px' })
      }}
    >
      {/*<Donate />*/}
      <PostLike
        liked={postInfo.liked}
        likeCount={postInfo.like_count}
        uri={postInfo.uri}
        sectionId={sectionId}
        showLikeList={showLikeList}
        reloadLikeList={() => {
          if (showType === 'like') {
            likeListRef.current?.reloadLikeList()
          }
        }}
      />

      {noMainPost && <span
        className={S.reply}
        onClick={reply}
      >回复&nbsp;({replyTotal})</span>}

      {noMainPost && <span className={S.opt}>{formatDate(postInfo.created)}</span>}
      <span className={'shrink-0'}>{floor}楼</span>
    </div>
    {showType === 'like' && <TabWrap arrowPos={arrowPos}>
      <LikeList uri={postInfo.uri} componentRef={likeListRef} />
    </TabWrap>}

    {showType === 'reply' && <TabWrap arrowPos={arrowPos}>
      <ReplyList
        total={replyTotal}
        changeTotal={setReplyTotal}
        rootUri={rootUri}
        uri={postInfo.uri}
        sectionId={sectionId}
        replyComment={openReplyModal}
        componentRef={replyListRef}
      />
    </TabWrap>}
  </>
}

export default PostItemFooter;