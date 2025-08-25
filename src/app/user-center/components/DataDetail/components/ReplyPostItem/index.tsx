'use client'

import { PostFeedItemType } from "@/app/posts/utils";
import { useEffect, useState } from "react";
import S from "./index.module.scss";
import Avatar from "@/components/Avatar";
import FeedStatistic from "@/components/FeedStatistic";
import utcToLocal from "@/lib/utcToLocal";

export default function ReplyPostItem({ feed, onClick, onHover, nickname }: {
  feed: PostFeedItemType;
  onClick?: () => void
  onHover?: () => void
  nickname: string
}) {
  const [innerRichText, setInnerRichText] = useState('')

  const title = feed.title

  const html = feed.text

  useEffect(() => {
    if (!html) return
    const div = document.createElement("div");
    div.innerHTML = html;
    setInnerRichText(div.innerText)
  }, [html]);

  return <div
    className={S.feed}
    onClick={onClick}
    onMouseEnter={onHover}
  >
    <div className={S.nickname}>
      <Avatar
        className={S.avatar}
        nickname={nickname}
      />
      {nickname}
      <span className={S.reply}>回复</span>
    </div>
    <p className={S.header}>
      {title}
    </p>

    <p className={S.feedInfo}>{innerRichText}</p>

    <div className={S.footer}>
      <div className={S.left}>
        <span>{feed.section}</span>
        <FeedStatistic
          visitedCount={feed.visited_count}
          replyCount={feed.reply_count}
        />
      </div>
      <span className={S.time}>{utcToLocal(feed.created)}</span>
    </div>
  </div>
}