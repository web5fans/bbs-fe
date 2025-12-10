import S from './index.module.scss'
import LikeIcon from '@/assets/notification/like.svg'
import MessageIcon from '@/assets/notification/message.svg'
import TipIcon from '@/assets/notification/tip.svg'
import CommentIcon from '@/assets/notification/comment.svg'
import Image from "next/image";
import remResponsive from "@/lib/rem-responsive";
import { useMemo } from "react";
import cx from "classnames";

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
      {/*<div className={S.messageInfo}>*/}
      {/*  <p>*/}
      {/*    <span className={S.name}>Xussd</span>*/}
      {/*    <span>点赞了你的帖子</span>*/}
      {/*  </p>*/}
      {/*  <p className={cx(S.post, S.maxRow1)}>Web5 技术架构深度解析</p>*/}
      {/*</div>*/}

      {/*<div className={S.messageInfo}>*/}
      {/*  <div className={'flex'}>*/}
      {/*    <span className={S.name}>Xussd</span>*/}
      {/*    <span>隐藏了你的帖子</span>&nbsp;*/}
      {/*    <p className={cx(S.post, S.maxRow1, 'flex-1')}>Web5 技术架构深度解析</p>*/}
      {/*  </div>*/}
      {/*  <p className={S.maxRow2}>原因：因违论坛规则-不允许使用xxxxxxxxx,隐藏帖子隐藏帖子隐藏帖子隐藏帖子帖子帖子隐藏帖子隐藏帖子隐藏帖子隐藏帖子帖子帖子隐藏帖子隐藏帖子隐藏帖子隐藏帖子帖子帖子隐藏帖子隐藏帖子隐藏帖子隐藏帖子帖子帖子隐藏帖子隐藏帖子隐藏帖子隐藏帖子帖子帖子隐藏帖子隐藏帖子隐藏帖子隐藏帖子帖子帖子</p>*/}
      {/*</div>*/}

      <div className={S.messageInfo}>
        <div>
          <span className={S.name}>XussdXussdXussd</span>
          打赏了你的帖子
          <span className={'text-[#999631] font-medium'}>123.12k CKB</span>
        </div>
        <div className={'flex'}>
          来自&nbsp;<span className={cx(S.post, S.maxRow1, 'flex-1')}>Web5 技术架构深度解析深度解析深度解析深度解析</span>
        </div>
      </div>
      <span className={S.time}>5分钟前</span>
    </div>
  </div>
}

export default MessageItem;