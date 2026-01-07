'use client'

import { CommentAllPostType } from "@/app/posts/utils";
import S from "./index.module.scss";
import Avatar from "@/components/Avatar";
import FeedStatistic, { FeedLikes } from "@/components/FeedStatistic";
import utcToLocal from "@/lib/utcToLocal";
import cx from "classnames";
import StreamLineRichText from "@/components/StreamLineRichText";

export default function CommentPostItem({ feed, onClick, onHover, nickname, disabled }: {
  feed: CommentAllPostType;
  onClick?: () => void
  onHover?: () => void
  nickname: string
  disabled?: boolean
}) {
  const title = feed.title

  const html = feed.comment_text

  return <div
    className={cx(S.feed, disabled && S.disabled)}
    onClick={() => {
      if (disabled) return
      onClick?.()
    }}
    onMouseEnter={onHover}
  >
    <div className={S.nickname}>
      <Avatar
        className={S.avatar}
        nickname={nickname}
      />
      {nickname}
      <span className={S.comment}>回复</span>
    </div>
    <p className={S.header}>
      {title}
    </p>

    <StreamLineRichText richText={html} className={S.feedInfo} />

    <div className={S.footer}>
      <div className={S.left}>
        <span>{feed.section}</span>
        <FeedStatistic
          visitedCount={feed.visited_count}
          commentCount={feed.comment_count}
        />
        <FeedLikes likesCount={feed.like_count} />
      </div>
      <span className={S.time}>{utcToLocal(feed.comment_created)}</span>
    </div>
  </div>
}