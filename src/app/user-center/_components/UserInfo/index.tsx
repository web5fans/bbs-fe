import S from './index.module.scss'
import cx from "classnames";
import Avatar from "@/components/Avatar";
import { UserProfileType } from "@/store/userInfo";
import utcToLocal from "@/lib/utcToLocal";
import { useEffect, useRef } from "react";
import FlatBottomedCard from "@/components/FlatBottomedCard";
import Copy from "@/components/CopyText/Copy";
import ellipsis from "@/lib/ellipsis";

const UserInfo = ({ userProfile, isMe, className }: {
  userProfile?: UserProfileType
  isMe?: boolean
  className?: string
}) => {
  return <div className={cx(S.container, className)}>
    <LeftInfo nickname={userProfile?.displayName} />
    <div className={S.rightWrap}>
      <CardItem title={'Web5域名'} content={userProfile?.handle} showCopy={isMe} />
      <CardItem title={'Web5 did'} content={userProfile?.did} showCopy={isMe} />
      <div className={S.register}>
        <CardItem title={'注册钱包地址'} content={userProfile?.ckb_addr || ''} needEllipsis showCopy={isMe} className={S.item} />
        <CardItem title={'注册时间'} content={utcToLocal(userProfile?.created, 'YYYY-MM-DD')} showCopy={false} className={S.item} />
      </div>
    </div>
  </div>
}

export default UserInfo;

function LeftInfo({ nickname }: {
  nickname?: string
}) {
  const avatarRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!avatarRef.current || !nickname) return
    const textWidth = nameRef.current?.scrollWidth;
    const defaultSize = getComputedStyle(nameRef.current).fontSize.replace('px', '');

    const resizeObserver = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        if (!nameRef.current || !avatarRef.current) return

        const isUnderAnd768 = window.innerWidth < 768

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
          if (isUnderAnd768) {
            nameRef.current.style.width = containerWidth + 'px';
          } else {
            nameRef.current.style.width = 'auto';
          }
        }
      })


    })
    resizeObserver.observe(avatarRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [nickname]);

  return <div className={S.leftWrap}>
    <div ref={avatarRef}>
      <Avatar
        nickname={nickname}
        className={S.avatar}
      />
    </div>
    <p className={S.userName} ref={nameRef}>{nickname}</p>
  </div>
}

function CardItem(props: {
  className?: string;
  title: string
  content: string
  showCopy?: boolean
  needEllipsis?: boolean
}) {
  const { showCopy = false, title, content, needEllipsis } = props;

  return <FlatBottomedCard className={cx(S.card, props.className)}>
    <div className={S.inner}>
      <div className={S.left}>
        <p className={S.title}>{title}</p>
        <p className={S.content}>{needEllipsis? ellipsis(content) :content}</p>
      </div>
      {showCopy && <Copy
        text={content}
        className={S.copy}
      />}
    </div>
  </FlatBottomedCard>
}