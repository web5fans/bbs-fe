import S from './index.module.scss'
import PostEdit from "@/app/posts/[postId]/_components/PostEdit";
import FeedStatistic from "@/components/FeedStatistic";
import JSONToHtml from "@/components/TipTapEditor/components/json-to-html/JSONToHtml";
import PostLike from "@/app/posts/[postId]/_components/PostLike";
import utcToLocal from "@/lib/utcToLocal";
import LikeList, { LikeListRef } from "@/app/posts/[postId]/_components/PostItem/_components/LikeList";
import { useEffect, useRef, useState } from "react";

function formatDate(date: string) {
  return utcToLocal(date, 'YYYY/MM/DD HH:mm:ss')
}

const PostItemContent = (props: {
  postInfo: any
  sectionId: string
  floor: number
  isAuthor?: boolean
}) => {
  const { postInfo, sectionId, floor } = props
  const [ showType, setShowType ] = useState<'like' | 'reply' | undefined>(undefined)

  const likeListRef = useRef<LikeListRef>(null)

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

        <JSONToHtml html={postInfo.text} />
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
        {postInfo.edited ? <span>更新于&nbsp;{formatDate(postInfo.edited)}</span>
          : <span>{formatDate(postInfo.created)}</span>}
        <span>{floor}楼</span>
      </div>
    </div>
    {showType === 'like' && <LikeList uri={postInfo.uri} componentRef={likeListRef} />}
  </>
}

export default PostItemContent;