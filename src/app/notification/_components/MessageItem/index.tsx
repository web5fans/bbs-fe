'use client'

import S from './index.module.scss'
import LikeIcon from '@/assets/notification/like.svg'
import CommentIcon from '@/assets/notification/comment.svg'
import MessageIcon from '@/assets/notification/message.svg'
import TipIcon from '@/assets/notification/tip.svg'
import { useMemo } from "react";
import cx from "classnames";
import { NOTIFY_TYPE_ENUM, NotifyItemType } from "@types/notification";
import StreamLineRichText from "@/components/StreamLineRichText";
import numeral from "numeral";
import { shannonToCkb } from "@/lib/utils";
import dayjs from "dayjs";
import server from "@/server";
import { useBoolean } from "ahooks";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { postUriToHref } from "@/lib/postUriHref";

const MessageItem = ({ notify, isReadAll }: {
  notify: NotifyItemType
  isReadAll?: boolean
}) => {
  const { userProfile } = useCurrentUser()
  const router = useRouter()
  const [hasRead, setHasRead] = useBoolean(!!notify.readed)

  const readNotify = async () => {
    await server('/notify/read', 'POST', {
      repo: userProfile?.did,
      target: Number(notify.id)
    })
    setHasRead.setTrue()
  }

  const getHref = () => {
    if (notify.n_type === NOTIFY_TYPE_ENUM.BE_HIDDEN) {
      return '/user-center'
    }
    const { post, index: targetIdx, nsid, comment } = notify.target;
    switch (nsid) {
      case "app.bbs.post":
        return `/posts/${postUriToHref(notify.target_uri)}`
      case "app.bbs.comment":
        return `/posts/${postUriToHref(post.uri)}?comment=${notify.target_uri}&commentIdx=${targetIdx}`
      case "app.bbs.reply":
        return `/posts/${postUriToHref(post.uri)}?comment=${comment?.uri}&commentIdx=${comment?.index}&reply=${notify.target_uri}&replyIdx=${targetIdx}`
    }
  }

  const detailInfo = useMemo(() => {
    const { n_type } = notify

    const postTypeName = {
      "app.bbs.post": '帖子',
      "app.bbs.comment": '评论',
      "app.bbs.reply": '回复'
    }[notify.target.nsid];

    switch (n_type) {
      case NOTIFY_TYPE_ENUM.NEW_COMMENT:
        return <div className={S.messageInfo}>
          <p>
            <span className={S.name}>{notify.sender.displayName}</span>
            <span>评论了你的帖子</span>
          </p>
          <p className={cx(S.post, S.maxRow1)}>
            {notify.target.post.title}
          </p>
        </div>;
      case NOTIFY_TYPE_ENUM.NEW_REPLY:
        return <div className={S.messageInfo}>
          <p>
            <span className={S.name}>{notify.sender.displayName}</span>
            <span>回复了你的评论</span>
          </p>
          <RichText richText={notify.target.text} />
        </div>;
      case NOTIFY_TYPE_ENUM.NEW_TIP:
        return <div className={S.messageInfo}>
          <div>
            <span className={S.name}>{notify.sender.displayName}</span>
            打赏了你的{postTypeName}
            <span className={'text-[#999631] font-medium'}>{numeral(shannonToCkb(notify.amount)).format('0.00a')} CKB</span>
          </div>
          <div className={'flex'}>
            来自&nbsp;<RichText richText={notify.target.title || notify.target.text} className={'flex-1'} />
          </div>
        </div>;
      case NOTIFY_TYPE_ENUM.NEW_LIKE:
        return <div className={S.messageInfo}>
          <p>
            <span className={S.name}>{notify.sender.displayName}</span>
            <span>点赞了你的{postTypeName}</span>
          </p>
          <RichText richText={notify.target.title || notify.target.text} />
        </div>;
      case NOTIFY_TYPE_ENUM.BE_HIDDEN:
        return <div className={S.messageInfo}>
          <div className={'flex'}>
            <span className={S.name}>{notify.sender.displayName}</span>
            <span>隐藏了你的{postTypeName}</span>&nbsp;
            <RichText richText={notify.target.title || notify.target.text} className={'flex-1'} />
          </div>
          <p className={S.maxRow2}>原因：{notify.target.reasons_for_disabled}</p>
        </div>;
      case NOTIFY_TYPE_ENUM.BE_DISPLAYED:
        return <div className={S.messageInfo}>
          <div className={'flex'}>
            <span className={S.name}>{notify.sender.displayName}</span>
            <span>公开了你的{postTypeName}</span>&nbsp;
          </div>
          <RichText richText={notify.target.title || notify.target.text} />
        </div>
    }

  }, [notify])

  const messageIcon = useMemo(() => {
    const { n_type } = notify

    switch (n_type) {
      case NOTIFY_TYPE_ENUM.NEW_COMMENT:
      case NOTIFY_TYPE_ENUM.NEW_REPLY:
        return <CommentIcon className={S.icon} />
      case NOTIFY_TYPE_ENUM.NEW_LIKE:
        return  <LikeIcon className={S.icon} />
      case NOTIFY_TYPE_ENUM.NEW_TIP:
        return <TipIcon className={S.icon} />
      default:
        return <MessageIcon className={S.icon} />
    }
  }, [notify])

  return <div
    className={S.messageItem}
    onClick={() => {
      const href = getHref()
      readNotify()
      router.push(href)
    }}>
    <div className={S.divide} />
    <div className={S.message}>
      <div className={'relative'}>
        {messageIcon}
        {!(hasRead || isReadAll) && <span className={S.unread} />}
      </div>
      {detailInfo}

      <span className={S.time}>
        {dayjs(notify.created).utc().local().from(dayjs()).replace(/\s/g, "")}
      </span>
    </div>
  </div>
}

export default MessageItem;

function RichText({ richText, className }: {
  richText: string
  className?: string
}) {
  return <StreamLineRichText richText={richText} className={cx(S.post, S.maxRow1, className)} />
}