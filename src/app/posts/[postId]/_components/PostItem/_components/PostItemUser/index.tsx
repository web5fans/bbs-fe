import S from "./index.module.scss";
import { PostItemType } from "@/app/posts/[postId]/_components/PostItem/index";
import { useEffect, useRef, useState } from "react";
import remResponsive from "@/lib/rem-responsive";
import cx from "classnames";
import Avatar from "@/components/Avatar";
import { useRouter } from "next/navigation";
import BadgeIcon from '@/assets/user-center/badge.svg'
import identityLabel from "@/lib/identityLabel";
import { formatLinkParam } from "@/lib/postUriHref";

const PostItemUser = ({ post, isOriginPoster }: { post: PostItemType; isOriginPoster?: boolean }) => {
  const [_, setRefresh] = useState(0)
  const router = useRouter()

  const href = `/user-center/${formatLinkParam(post.author?.did)}`

  const nickname = post.author?.displayName

  const goUserCenter = (author) => {
    if (!author.handle) return
    router.push(href)
  }

  useEffect(() => {
    const f = () => {
      requestAnimationFrame(() => {
        setRefresh(v => v + 1)
      })
    }

    window.addEventListener('resize', f);

    return () => {
      window.removeEventListener('resize', f);
    }

  }, []);

  if (window.innerWidth <= 768) return null

  return <div
    className={S.user}
    onClick={() => goUserCenter(post.author)}
    onMouseEnter={() => router.prefetch(href)}
  >
    <UserAvatar
      nickname={nickname}
      isOriginPoster={isOriginPoster}
      isLoggedOff={!post.author?.handle}
      tags={post.author?.tags}
    />
    <div className={S.divide} />
    <p className={S.postNum}>
      <span>发帖数量</span>
      <span>{post.author?.post_count}</span>
    </p>
  </div>
}

export default PostItemUser;

let resizeObserver: ResizeObserver | null = null;

function UserAvatar({ isOriginPoster, nickname, isLoggedOff, tags }: {
  isOriginPoster?: boolean
  nickname: string
  isLoggedOff?: boolean
  tags: PostItemType['author']['tags']
}) {
  const avatarRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
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
          if (identityRef.current) {
            identityRef.current.style.width = `${containerWidth}px`;
          }

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
    {tags && <div className={S.identity} ref={identityRef}>
      <BadgeIcon className={S.bagde} />
      {identityLabel(tags)}
      <BadgeIcon className={S.bagde} />
    </div>}
  </>
}