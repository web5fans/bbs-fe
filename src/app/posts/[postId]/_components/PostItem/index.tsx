'use client'

import S from './index.module.scss'
import Avatar from "@/components/Avatar";
import FeedStatistic from "@/components/FeedStatistic";
import cx from "classnames";
import JSONToHtml from "@/components/TipTapEditor/components/json-to-html/JSONToHtml";
import { useRouter } from "next/navigation";
import PostItemFooter from "./PostItemFooter";
import PostEdit from "@/app/posts/[postId]/_components/PostEdit";

type PostItemProps = {
  isOriginPoster?: boolean
  postInfo: any
  sectionId: string
  floor: number
  isAuthor?: boolean
}

const PostItem = (props: PostItemProps) => {
  const { postInfo = {}, floor, isOriginPoster, sectionId } = props;

  const router = useRouter()

  const nickname = postInfo.author?.displayName

  const href = `/user-center/${encodeURIComponent(postInfo.author?.did)}`

    return <div className={S.wrap}>
    <div className={S.user} onClick={() => router.push(href)} onMouseEnter={() => router.prefetch(href)}>
      <div className={cx(S.avatarWrap, !isOriginPoster && S.normal)}>
        <Avatar nickname={nickname} className={S.avatar} />
        <img src={'/assets/poster.png'} alt="" className={S.poster} />
      </div>
      <p className={S.title}>{nickname}</p>
      <div className={S.divide} />
      <p className={S.postNum}>
        <span>发帖数量</span>
        <span>{postInfo.author?.post_count}</span>
      </p>
    </div>

    <div className={S.content}>
      <div>
        {postInfo.title && <>
          <div className={S.title}>
            <span className={S.titleInner}>{postInfo.title}</span>
            {props.isAuthor && <PostEdit uri={postInfo.uri} />}
          </div>
          <div className={S.statis}>
            {postInfo.section}
            <FeedStatistic visitedCount={postInfo.visited_count} commentCount={postInfo.comment_count} />
          </div>
        </>}

        <JSONToHtml html={postInfo.text} />
      </div>

      <PostItemFooter postInfo={postInfo} sectionId={sectionId} floor={floor} />
    </div>
  </div>
}

export default PostItem;