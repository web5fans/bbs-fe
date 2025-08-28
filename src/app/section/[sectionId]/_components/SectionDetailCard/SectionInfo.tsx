import S from './index.module.scss'
import FeedStatistic from "@/components/FeedStatistic";
import type { SectionItem } from "@/app/posts/utils";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useEffect, useRef } from "react";

export default function SectionInfo(props: {
  sectionInfo?: SectionItem
  children?: React.ReactNode
}){
  const { sectionInfo } = props;
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const { isMobile } = useMediaQuery()

  useEffect(() => {
    if (!contentRef.current) return
    const resizeObserver = new ResizeObserver((entries) => {
      if (!imageRef.current) return

      const isUnderAnd768 = window.innerWidth <= 768

      if (!isUnderAnd768) {
        imageRef.current.style.width = '100%'
        return;
      }

      const height = entries[0].contentRect.height
      imageRef.current.style.width = height + 'px'
    })
    resizeObserver.observe(contentRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, []);

  return <>
    <div className={S.inner}>
      <div className={S.sectionImage} ref={imageRef} />
      <div className={S.innerContent} ref={contentRef}>
        <p className={S.title}>{sectionInfo?.name}</p>
        <div className={S.statis}>
          {sectionInfo?.owner?.displayName && <p>
            版主：<span className={'text-black'}>{sectionInfo?.owner?.displayName}</span>
          </p>}
          <FeedStatistic
            replyCount={sectionInfo?.reply_count}
            visitedCount={sectionInfo?.visited_count}
          />
        </div>
        {!isMobile && props.children}
      </div>
    </div>
    {isMobile && props.children}
  </>
};