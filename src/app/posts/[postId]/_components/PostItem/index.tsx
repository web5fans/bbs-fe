'use client'

import S from './index.module.scss'
import cx from "classnames";
import PostItemContent from "./PostItemContent";
import { useEffect, useRef, useState } from "react";
import PostItemFooter from "./_components/PostItemFooter";
import PostItemUser from "./_components/PostItemUser";
import PostItemUserMobile from "./_components/PostItemUserMobile";
import { useSearchParams } from "next/navigation";
import { usePost } from "@/app/posts/[postId]/_components/Post404Auth";

export type PostItemType = {
  cid: string
  uri: string
  comment_count: string
  like_count: string
  reply_count?: string
  section_id: string // 版区id
  section?: string // 版区名称
  text: string
  title?: string
  created: string
  edited?: string
  liked?: boolean
  author: {
    did: string
    displayName: string
    handle: string
    [key: string]: any
  }
  [key: string]: any
  is_disabled: boolean
  reasons_for_disabled: string | null
}

type PostItemProps = {
  isOriginPoster?: boolean
  postInfo: PostItemType
  floor: number
  rootUri: string
  refresh?: () => void
  rootDisabled?: boolean
}

const PostItem = (props: PostItemProps) => {
  const { postInfo = {} as PostItemType, floor, isOriginPoster, rootUri, rootDisabled } = props;

  const [postDisabled, setPostDisabled] = useState(false)

  const wrapRef = useRef<HTMLDivElement>(null)

  const { anchorInfo, clearAnchorInfo } = usePost()

  useEffect(() => {
    setPostDisabled(postInfo.is_disabled)
  }, [postInfo]);

  const switchPostVisibility = () => {
    setPostDisabled(!postDisabled)
  }

  const disabled = rootDisabled || postDisabled

  const scrollToTarget = () => {
    if (!anchorInfo || anchorInfo?.reply) return;
    if (anchorInfo.comment.uri !== postInfo.uri) return
    wrapRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
    clearAnchorInfo()
  }

  return <div className={S.wrap} ref={wrapRef}>

    <PostItemUser post={postInfo} isOriginPoster={isOriginPoster} />

    <div className={S.contentWrap}>
      <PostItemUserMobile post={postInfo} isOriginPoster={isOriginPoster} />
      <div className={S.content}>
        {disabled && <div className={cx(S.mask, rootDisabled && '!z-5')} />}
        <div className={S.contentInner}>
          <PostItemContent
            postInfo={postInfo}
            rootUri={rootUri}
            refresh={props.refresh}
            scrollToTarget={scrollToTarget}
          />
        </div>
        <PostItemFooter
          postInfo={{...postInfo, is_disabled: postDisabled}}
          floor={floor}
          rootUri={rootUri}
          refresh={props.refresh}
          switchPostVisibility={switchPostVisibility}
        />
      </div>
    </div>
  </div>
}

export default PostItem;