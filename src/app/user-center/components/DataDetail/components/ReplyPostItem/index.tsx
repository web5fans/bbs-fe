'use client'

import { PostFeedItemType } from "@/app/posts/utils";
import { useEffect, useRef, useState } from "react";
import { handleToNickName } from "@/lib/handleToNickName";
import S from "./index.module.scss";
import Avatar from "@/components/Avatar";
import FeedStatistic from "@/components/FeedStatistic";
import utcToLocal from "@/lib/utcToLocal";

export default function ReplyPostItem({ feed, onClick, onHover }: {
  feed: PostFeedItemType;
  onClick?: () => void
  onHover?: () => void
}) {
  const { author } = feed;

  const [innerRichText, setInnerRichText] = useState('')
  const contentRef = useRef<HTMLDivElement>(null);

  const nickname = handleToNickName(author.displayName);

  const title = feed.title

  const html = feed.text

  useEffect(() => {
    const text = contentRef.current?.innerText
    setInnerRichText(text)
  }, []);

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

    <div
      ref={contentRef}
      className={'h-0 overflow-hidden'}
      dangerouslySetInnerHTML={{ __html: html }}
    />

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