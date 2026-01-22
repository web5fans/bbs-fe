import S from './sectionInfo.module.scss'
import FeedStatistic from "@/components/FeedStatistic";
import type { SectionItem } from "@/app/posts/utils";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useEffect, useRef, useState } from "react";
import ExpandIcon from '@/assets/arrow.svg'

export default function SectionInfo(props: {
  sectionInfo?: SectionItem
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
    <div className={S.wrap}>
      <div className={S.sectionImage} ref={imageRef} style={sectionInfo?.image ? { backgroundImage: `url(${sectionInfo?.image})` } : {}} />
      <div className={S.content} ref={contentRef}>
        <p className={S.title}>{sectionInfo?.name}</p>
        <div className={S.statis}>
          {sectionInfo?.owner?.displayName && <p>
            版主：<span className={'text-black capitalize'}>{sectionInfo?.owner?.displayName}</span>
          </p>}
          <FeedStatistic
            commentCount={sectionInfo?.comment_count}
            visitedCount={sectionInfo?.visited_count}
          />
        </div>
        {!isMobile && <DesInfo description={sectionInfo?.description} />}
      </div>
    </div>
    {isMobile && <DesInfo description={sectionInfo?.description} />}
  </>
};

const SPLIT_NUMBER = 145

function DesInfo({ description = '' }: { description?: string }) {
  const [expand, setExpand] = useState(false)

  const infoRef = useRef<HTMLDivElement>(null);

  const needSplit = (description?.length || 0) > SPLIT_NUMBER

  const renderInfo = () => {
    if (!needSplit) return description

    if (expand) {
      return <>
        {description}
        <p
          className={S.packUp}
          onClick={() => setExpand(false)}
        >
          收起<ExpandIcon className={S.icon} />
        </p>
      </>
    }

    const showDes = (description || '').slice(0, SPLIT_NUMBER)
    return <>
      {showDes}...
      <p
        className={S.expand}
        onClick={() => setExpand(true)}
      >
        展开<ExpandIcon className={S.icon} />
      </p>
    </>
  }

  return <div
    className={S.des}
    ref={infoRef}
  >
    {renderInfo()}
  </div>
}