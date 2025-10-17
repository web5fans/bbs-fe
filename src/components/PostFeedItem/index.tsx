'use client'

import { PostFeedItemType } from "@/app/posts/utils";
import { useEffect, useRef, useState } from "react";
import { handleToNickName } from "@/lib/handleToNickName";
import S from "./index.module.scss";
import Avatar from "@/components/Avatar";
import FeedStatistic, { FeedLikes } from "@/components/FeedStatistic";
import utcToLocal from "@/lib/utcToLocal";
import TopPIcon from '@/assets/posts/top-p.svg';
import cx from "classnames";

export default function PostFeedItem({ feed, onClick, onHover, headerOpts, disabled }: {
  feed: PostFeedItemType;
  onClick?: () => void
  onHover?: () => void;
  headerOpts?: (post: PostFeedItemType, itemHover: boolean) => React.ReactNode;
  disabled?: boolean
}) {
  const { author } = feed;

  const [innerRichText, setInnerRichText] = useState('')

  const [isHover, setIsHover] = useState(false)

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
    className={cx(S.feed, disabled && S.disabled)}
    onClick={() => {
      if (disabled) return
      onClick?.()
    }}
    onMouseEnter={() => {
      if (disabled) return
      onHover?.()
      setIsHover(true)
    }}
    onMouseLeave={() => setIsHover(false)}
  >
    <div className={S.header}>
      {feed.is_top && <TopPIcon className={S.top} />}
      <p className={S.title}>
        {title}
      </p>
      <div onClick={e => e.stopPropagation()} className={S.opts}>
        {headerOpts?.(feed, isHover)}
      </div>
    </div>

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
        <FeedLikes likesCount={feed.like_count} />
      </div>
      <span className={S.time}>{utcToLocal(feed.created)}</span>
    </div>
  </div>
}