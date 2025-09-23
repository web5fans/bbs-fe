'use client'

import S from './index.module.scss'
import Avatar from "@/components/Avatar";
import cx from "classnames";
import { useRouter } from "next/navigation";
import PostItemContent from "./PostItemContent";
import { useEffect, useRef } from "react";
import remResponsive from "@/lib/rem-responsive";

type PostItemProps = {
  isOriginPoster?: boolean
  postInfo: any
  sectionId: string
  floor: number
  isAuthor?: boolean
  rootUri: string
  refresh?: () => void
}

const PostItem = (props: PostItemProps) => {
  const { postInfo = {}, floor, isOriginPoster, sectionId, isAuthor } = props;

  const router = useRouter()

  const nickname = postInfo.author?.displayName

  const href = `/user-center/${encodeURIComponent(postInfo.author?.did)}`

  const ref = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

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

  return <div className={S.wrap}>
    <div
      ref={ref}
      className={S.user}
      onClick={() => goUserCenter(postInfo.author)}
      onMouseEnter={() => router.prefetch(href)}
    >
      <UserAvatar nickname={nickname} isOriginPoster={isOriginPoster} isLoggedOff={!postInfo.author.handle} />
      <div className={S.divide} />
      <p className={S.postNum}>
        <span>发帖数量</span>
        <span>{postInfo.author?.post_count}</span>
      </p>
    </div>

    <div className={S.content} ref={contentRef}>
      <PostItemContent
        postInfo={postInfo}
        sectionId={sectionId}
        floor={floor}
        isAuthor={isAuthor}
        rootUri={props.rootUri}
        refresh={props.refresh}
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

  useEffect(() => {
    if (!avatarRef.current || !nickname) return
    const tempSpan = document.createElement("span");
    tempSpan.innerText = nickname;
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
  }, [nickname]);

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
    >{isLoggedOff ? '已注销' : nickname}</p>
  </>
}