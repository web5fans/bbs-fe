import S from './index.module.scss'
import LikeIcon from '@/assets/notification/like.svg'
import MessageIcon from '@/assets/notification/message.svg'
import TipIcon from '@/assets/notification/tip.svg'
import CommentIcon from '@/assets/notification/comment.svg'
import Image from "next/image";
import remResponsive from "@/lib/rem-responsive";
import { useMemo } from "react";

interface MessageItemProps {
  type: 'like' | 'message' | 'tip'
}

const MessageItem = () => {

  const detailInfo = useMemo(() => {
    return {
      info: '点赞了你的帖子',
      detail: ''
    }
  }, [])

  return <div className={S.messageItem}>
    <div className={S.divide} />
    <div className={S.message}>
      <div className={'relative'}>
        <LikeIcon className={S.icon} />
        <span className={S.unread}/>
      </div>
      <div className={S.messageInfo}>
        <p>
          <span className={S.name}>Xussd</span>
          <span>点赞了你的帖子</span>
        </p>
        <p className={S.info}>原因：因违论坛规则-不允许使用xxxxxxxxx,隐藏帖子隐藏帖子隐藏帖子隐藏帖子帖子帖子</p>
      </div>
      <span className={S.time}>5分钟前</span>
    </div>
  </div>
}

export default MessageItem;