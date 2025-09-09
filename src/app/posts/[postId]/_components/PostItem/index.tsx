'use client'

import S from './index.module.scss'
import Avatar from "@/components/Avatar";
import cx from "classnames";
import { useRouter } from "next/navigation";
import PostItemContent from "./PostItemContent";
import { useEffect, useRef } from "react";

type PostItemProps = {
  isOriginPoster?: boolean
  postInfo: any
  sectionId: string
  floor: number
  isAuthor?: boolean
}

const PostItem = (props: PostItemProps) => {
  const { postInfo = {}, floor, isOriginPoster, sectionId, isAuthor } = props;

  const router = useRouter()

  const nickname = postInfo.author?.displayName

  const href = `/user-center/${encodeURIComponent(postInfo.author?.did)}`

  const ref = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        if (!ref.current) return
        const height = ref.current.clientHeight
        contentRef.current.style.setProperty('--height', `${height}px`)
      })
    })

    observer.observe(ref.current)

    return () => {
      if (!ref.current) return
      observer.unobserve(ref.current)
    }
  }, []);

  return <div className={S.wrap}>
    <div
      ref={ref}
      className={S.user}
      onClick={() => router.push(href)}
      onMouseEnter={() => router.prefetch(href)}
    >
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

    <div className={S.content} ref={contentRef}>
      <PostItemContent postInfo={postInfo} sectionId={sectionId} floor={floor} isAuthor={isAuthor} />
    </div>
  </div>
}

export default PostItem;