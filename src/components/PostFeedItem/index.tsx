'use client'

import { PostFeedItemType } from "@/app/posts/utils";
import { useEffect, useRef, useState } from "react";
import { handleToNickName } from "@/lib/handleToNickName";
import S from "./index.module.scss";
import Avatar from "@/components/Avatar";
import FeedStatistic from "@/components/FeedStatistic";
import utcToLocal from "@/lib/utcToLocal";

export default function PostFeedItem({ feed, onClick, onHover }: {
  feed: PostFeedItemType;
  onClick?: () => void
  onHover?: () => void
}) {
  const { author } = feed;

  const [innerRichText, setInnerRichText] = useState('')

  const nickname = handleToNickName(author.displayName);

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
    <p className={S.header}>
      {title}
    </p>

    <p className={S.feedInfo}>{innerRichText}</p>

    <div className={S.footer}>
      <div className={S.left}>
        {nickname && <div className={S.nickname}>
          <Avatar
            className={S.avatar}
            nickname={nickname}
          />
          {nickname}
        </div>}
        <span>{feed.section}</span>
        <FeedStatistic visitedCount={feed.visited_count} commentCount={feed.comment_count} />
      </div>
      <span className={S.time}>{utcToLocal(feed.created)}</span>
    </div>
  </div>
}