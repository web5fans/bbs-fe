import S from './index.module.scss'
import PostEdit from "@/app/posts/[postId]/_components/PostEdit";
import FeedStatistic from "@/components/FeedStatistic";
import JSONToHtml from "@/components/TipTapEditor/components/json-to-html/JSONToHtml";
import PostLike from "@/app/posts/[postId]/_components/PostLike";
import utcToLocal from "@/lib/utcToLocal";
import LikeList, { LikeListRef } from "./_components/LikeList";
import { useEffect, useRef, useState } from "react";
import { usePostCommentReply } from "@/provider/PostReplyProvider";
import QuotePopUp from "./_components/QuotePopUp";
import ReplyList from "./_components/ReplyList";
import TabWrap from "./_components/TabWrap";
import Donate from "@/app/posts/[postId]/_components/PostItem/_components/Donate";

function formatDate(date: string) {
  return utcToLocal(date, 'YYYY/MM/DD HH:mm:ss')
}

const PostItemContent = (props: {
  postInfo: any
  sectionId: string
  floor: number
  isAuthor?: boolean
  rootUri: string
  refresh?: () => void
}) => {
  const { postInfo, sectionId, floor, rootUri } = props
  const [ showType, setShowType ] = useState<'like' | 'reply' | undefined>(undefined)
  const [replyTotal, setReplyTotal] = useState('0')

  const likeListRef = useRef<LikeListRef>(null)

  const [arrowPos, setArrowPos] = useState<{ left: string } | undefined>(undefined)

  const { openModal } = usePostCommentReply()

  const reply = () => {
    if (!postInfo.reply_count || postInfo.reply_count === '0') {
      openReplyModal()
      return;
    }
    if (showType === 'reply') {
      setShowType(undefined);
      return
    }
    setShowType('reply')
    openReplyModal()
  }

  const openReplyModal = () => {
    openModal({
      type: 'reply',
      postUri: rootUri,
      commentUri: postInfo.uri,
      toUserName: postInfo.author.displayName,
      sectionId,
      refresh: props.refresh
    })
  }

  const showLikeList = () => {
    if (showType === 'like') {
      setShowType(undefined);
      return
    }
    setShowType("like")
  }

  const quoteComment = (quoteContent: string) => {
    openModal({
      type: 'quote',
      postUri: rootUri,
      sectionId,
      quoteContent,
      refresh: props.refresh
    })
  }

  useEffect(() => {
    setReplyTotal(postInfo.reply_count || '0')
  }, [postInfo.reply_count]);

  return <>
    <div className={S.contentInner}>
      <div>
        {postInfo.title && <>
          <div className={S.title}>
            <span className={S.titleInner}>{postInfo.title}</span>
            {props.isAuthor && <PostEdit uri={postInfo.uri} />}
          </div>
          <div className={S.statis}>
            {postInfo.section}
            <FeedStatistic
              visitedCount={postInfo.visited_count}
              commentCount={postInfo.comment_count}
            />
          </div>
        </>}

        {
          rootUri === postInfo.uri ? <QuotePopUp quoteComment={quoteComment}>
            <JSONToHtml html={postInfo.text} />
          </QuotePopUp> : <JSONToHtml html={postInfo.text} />
        }
      </div>

      <div
        className={S.floor}
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

        <span
          className={S.reply}
          onClick={reply}
        >回复&nbsp;({replyTotal})</span>

        {postInfo.edited ? <span className={S.opt}>更新于&nbsp;{formatDate(postInfo.edited)}</span>
          : <span className={S.opt}>{formatDate(postInfo.created)}</span>}
        <span className={'shrink-0'}>{floor}楼</span>
      </div>
    </div>

    {showType === 'like' && <TabWrap arrowPos={arrowPos}>
      <LikeList
        uri={postInfo.uri}
        componentRef={likeListRef}
      />
    </TabWrap>}

    {showType === 'reply' && <TabWrap arrowPos={arrowPos}>
      <ReplyList
        total={replyTotal}
        changeTotal={setReplyTotal}
        rootUri={rootUri}
        uri={postInfo.uri}
        sectionId={sectionId}
      />
    </TabWrap>}
  </>
}

export default PostItemContent;