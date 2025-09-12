import S from './index.module.scss'
import PostEdit from "@/app/posts/[postId]/_components/PostEdit";
import FeedStatistic from "@/components/FeedStatistic";
import JSONToHtml from "@/components/TipTapEditor/components/json-to-html/JSONToHtml";
import PostLike from "@/app/posts/[postId]/_components/PostLike";
import utcToLocal from "@/lib/utcToLocal";
import LikeList, { LikeListRef } from "@/app/posts/[postId]/_components/PostItem/_components/LikeList";
import { useEffect, useRef, useState } from "react";
import { usePostCommentReply } from "@/provider/PostReplyProvider";
import QuotePopUp from "./_components/QuotePopUp";
import ReplyList from "@/app/posts/[postId]/_components/PostItem/_components/ReplyList";

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

  const likeListRef = useRef<LikeListRef>(null)

  const { openModal } = usePostCommentReply()

  const reply = () => {
    setShowType('reply')
    openModal({
      type: 'reply',
      postUri: rootUri,
      commentUri: postInfo.uri,
      toUserName: postInfo.author.displayName,
      sectionId,
      refresh: props.refresh
    })
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

      <div className={S.floor}>
        <PostLike
          liked={postInfo.liked}
          likeCount={postInfo.like_count}
          uri={postInfo.uri}
          sectionId={sectionId}
          showLikeList={() => {
            if (showType === 'like') {
              setShowType(undefined);
              return
            }
            setShowType("like")
          }}
          reloadLikeList={() => {
            if (showType === 'like') {
              likeListRef.current?.reloadLikeList()
            }
          }}
        />
        <span className={'text-black cursor-pointer'} onClick={reply}>回复({postInfo.reply_count || 0})</span>
        {postInfo.edited ? <span>更新于&nbsp;{formatDate(postInfo.edited)}</span>
          : <span>{formatDate(postInfo.created)}</span>}
        <span>{floor}楼</span>
      </div>
    </div>
    {showType === 'like' && <LikeList uri={postInfo.uri} componentRef={likeListRef} />}
    {showType === 'reply' && <ReplyList total={postInfo.reply_count || '0'}  rootUri={rootUri} uri={postInfo.uri} sectionId={sectionId} />}
  </>
}

export default PostItemContent;