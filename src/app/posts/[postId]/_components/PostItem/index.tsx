'use client'

import S from './index.module.scss'
import Avatar from "@/components/Avatar";
import FeedStatistic from "@/components/FeedStatistic";
import cx from "classnames";
import utcToLocal from "@/lib/utcToLocal";
import JSONToHtml from "@/components/TipTapEditor/components/json-to-html/JSONToHtml";

type PostItemProps = {
  isOriginPoster?: boolean
  postInfo: any
  floor: number
}

const PostItem = (props: PostItemProps) => {
  const { postInfo = {}, floor, isOriginPoster } = props;

  const nickname = postInfo.author?.displayName

    return <div className={S.wrap}>
    <div className={S.user}>
      <div className={cx(S.avatarWrap, !isOriginPoster && S.normal)}>
        <Avatar nickname={nickname} className={S.avatar} />
        <img src={'/assets/poster.png'} alt="" className={S.poster} />
      </div>
      <p className={S.title}>{nickname}</p>
      <div className={S.divide} />
      <p className={S.postNum}>
        <span>发帖数量</span>
        <span>12</span>
      </p>
    </div>

    <div className={S.content}>
      <div>
        {postInfo.title && <>
          <p className={S.title}>{postInfo.title}</p>
          <div className={S.statis}>
            {postInfo.section}
            <FeedStatistic visitedCount={postInfo.visited_count} />
          </div>
        </>}

        {/*<TipTapEditor*/}
        {/*  initialContent={postInfo.text}*/}
        {/*  editable={false}*/}
        {/*  editorClassName={S.richText}*/}
        {/*  editorWrapClassName={'!h-auto'}*/}
        {/*/>*/}
        <JSONToHtml html={postInfo.text} />
      </div>

      <div className={S.floor}>
        <span>{utcToLocal(postInfo.created)}</span>
        <span>{floor}楼</span>
      </div>
    </div>
  </div>
}

export default PostItem;