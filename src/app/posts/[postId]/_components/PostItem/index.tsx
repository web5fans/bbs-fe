'use client'

import S from './index.module.scss'
import Avatar from "@/components/Avatar";
import cx from "classnames";
import { useRouter } from "next/navigation";
import PostItemContent from "./PostItemContent";
import { useEffect, useRef, useState } from "react";
import remResponsive from "@/lib/rem-responsive";
import PostItemFooter from "./_components/PostItemFooter";

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
  isAuthor?: boolean
  rootUri: string
  refresh?: () => void
  rootDisabled?: boolean
}

const PostItem = (props: PostItemProps) => {
  const { postInfo = {} as PostItemType, floor, isOriginPoster, isAuthor, rootUri, rootDisabled } = props;

  const router = useRouter()

  const nickname = postInfo.author?.displayName

  const href = `/user-center/${encodeURIComponent(postInfo.author?.did)}`

  const ref = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [postDisabled, setPostDisabled] = useState(false)

  useEffect(() => {
    setPostDisabled(postInfo.is_disabled)
  }, [postInfo]);

  const switchPostVisibility = () => {
    setPostDisabled(!postDisabled)
  }

  // useEffect(() => {
  //   const observer = new ResizeObserver(() => {
  //     requestAnimationFrame(() => {
  //       if (!ref.current) return
  //       const height = ref.current.clientHeight
  //       contentRef.current.style.setProperty('--height', `${height}px`)
  //     })
  //   })
  //
  //   observer.observe(ref.current)
  //
  //   return () => {
  //     if (!ref.current) return
  //     observer.unobserve(ref.current)
  //   }
  // }, []);

  const goUserCenter = (author) => {
    if (!author.handle) return
    router.push(href)
  }

  const disabled = rootDisabled || postDisabled

  return <div className={S.wrap}>
    <div
      ref={ref}
      className={S.user}
      onClick={() => goUserCenter(postInfo.author)}
      onMouseEnter={() => router.prefetch(href)}
    >
      <UserAvatar nickname={nickname} isOriginPoster={isOriginPoster} isLoggedOff={!postInfo.author?.handle} />
      <div className={S.divide} />
      <p className={S.postNum}>
        <span>发帖数量</span>
        <span>{postInfo.author?.post_count}</span>
      </p>
    </div>

    <div className={S.content} ref={contentRef}>
      {disabled && <div className={cx(S.mask, rootDisabled && '!z-5')} />}
      <div className={S.contentInner}>
        <PostItemContent
          postInfo={postInfo}
          isAuthor={isAuthor}
          rootUri={rootUri}
          refresh={props.refresh}
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
}

export default PostItem;

let resizeObserver: ResizeObserver | null = null;

function UserAvatar({ isOriginPoster, nickname, isLoggedOff }: {
  isOriginPoster?: boolean
  nickname: string
  isLoggedOff?: boolean
}) {
  const avatarRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const name = isLoggedOff ? '已注销' : nickname

  useEffect(() => {
    if (!avatarRef.current || !name) return
    const tempSpan = document.createElement("span");
    tempSpan.innerText = name;
    tempSpan.style.cssText = `
        width: fit-content;
        font-family: ${getComputedStyle(nameRef.current).fontFamily};
        font-size: ${remResponsive(9)};
      `;

    document.body.appendChild(tempSpan);
    const textWidth = tempSpan.clientWidth;
    const defaultSize = getComputedStyle(tempSpan).fontSize.replace('px', '');

    document.body.removeChild(tempSpan);

    const resizeFont = () => {
      resizeObserver = new ResizeObserver((entries) => {
        requestAnimationFrame(() => {
          if (!nameRef.current || !avatarRef.current) return

          // 获取容器和文本宽度
          const containerWidth = avatarRef.current?.scrollWidth;

          if (!containerWidth) return

          if (textWidth > containerWidth) {
            // 计算需要缩小的比例
            const ratio = containerWidth / textWidth;
            let newSize = Math.floor(defaultSize * ratio) - 1;

            // 设置最小字体限制
            newSize = Math.max(newSize, 8);

            // 应用新字体大小
            nameRef.current.style.fontSize = newSize + 'px';
            nameRef.current.style.width = containerWidth + 'px';
            nameRef.current.style.whiteSpace = 'normal';
            nameRef.current.style.height = 'auto';
          } else {
            nameRef.current.style.width = 'auto';
            nameRef.current.style.height = 'auto';
          }
        })


      })
      resizeObserver.observe(avatarRef.current)
    }

    resizeFont()

    const f = () => {
      nameRef.current.style.height = nameRef.current.clientHeight + 'px';
      nameRef.current.style.width = '0px';
      resizeObserver?.unobserve(avatarRef.current)
      resizeFont()
    }

    window.addEventListener('resize', f);

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', f);
    }
  }, [name]);

  return <>
    <div className={cx(S.avatarWrap, !isOriginPoster && S.normal)} ref={avatarRef}>
      <Avatar
        nickname={nickname}
        className={S.avatar}
      />
      <img
        src={'/assets/poster.png'}
        alt=""
        className={S.poster}
      />
    </div>
    <p
      className={S.title}
      ref={nameRef}
    >{name}</p>
  </>
}