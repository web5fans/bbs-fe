'use client'

import CardWindow from "@/components/CardWindow";
import S from './index.module.scss'
import FeedStatistic from "@/components/FeedStatistic";
import Button from "@/components/Button";
import MouseToolTip from "@/components/MouseToolTip";
import { useEffect, useRef, useState } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import useUserInfoStore from "@/store/userInfo";
import { useRequest } from "ahooks";
import server from "@/server";
import { SectionItem } from "@/app/posts/utils";

const SPLIT_NUMBER = 145
const DESCRIPTION_MIN_HEIGHT = 64

const SectionDetailCard = (props: {
  goToPublish: () => void
  sectionId: string
}) => {
  const { userInfo } = useUserInfoStore()
  const [expand, setExpand] = useState(false)
  const infoRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const { data: sectionInfo } = useRequest(async () => {
    return await server<SectionItem>('/section/detail', 'GET', {
      id: props.sectionId
    })
  }, {
    ready: !!props.sectionId,
    refreshDeps: [props.sectionId]
  })

  const needSplit = (sectionInfo?.description?.length || 0) > SPLIT_NUMBER

  useEffect(() => {
    const height = infoRef.current?.clientHeight
    if (!height) return
    if (height > DESCRIPTION_MIN_HEIGHT) {
      imageRef.current.style.width = '100%'
    } else {
      imageRef.current.style.width = '150px'
    }
  }, [])

  const renderInfo = () => {
    if (!needSplit) return sectionInfo?.description

    if (expand) {
      return <>
        {sectionInfo?.description}
        <p className={S.packUp} onClick={() => setExpand(false)}>
          收起<ExpandIcon />
        </p>
      </>
    }

    const showDes = (sectionInfo?.description || '').slice(0, SPLIT_NUMBER)
    return <>
      {showDes}...
      <p className={S.expand} onClick={() => setExpand(true)}>
        展开<ExpandIcon />
      </p>
    </>
  }

  return <CardWindow
    wrapClassName={S.wrap}
    headerExtra={<BreadCrumbs
      className={S.breadCrumb}
      breads={[{
        title: '首页',
        route: '/posts'
      }, {
        title: '版区详情'
      }]}
    />}
  >
    <div className={S.inner}>
      <div className={S.sectionImage} ref={imageRef}/>
      <div className={S.innerContent}>
        <p className={S.title}>{sectionInfo?.name}</p>
        <div className={S.statis}>
          {sectionInfo?.owner?.displayName && <p>
            版主：<span className={'text-black'}>{sectionInfo?.owner?.displayName}</span>
          </p>}
          <FeedStatistic replyCount={sectionInfo?.reply_count} visitedCount={sectionInfo?.visited_count} />
        </div>
        <div className={S.content} ref={infoRef}>
          {renderInfo()}
        </div>
      </div>

      <MouseToolTip open={!userInfo}>
        <div className={S.buttonWrap}>
          <Button
            type={'primary'}
            className={S.button}
            disabled={!userInfo}
            onClick={props.goToPublish}
          >
            <PlusIcon />发布讨论
          </Button>
        </div>
      </MouseToolTip>
    </div>


  </CardWindow>
}

export default SectionDetailCard;

function PlusIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M8.7265 0.00142033V7.2735H15.9986V8.72792H8.7265V16L7.27208 15.9986V8.72792H0V7.2735H7.27208V0L8.7265 0.00142033Z"
      fill="currentColor"
    />
  </svg>
}

function ExpandIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M9 12H7V10H9V12ZM7 10H5V8H7V10ZM11 10H9V8H11V10ZM5 8H3V6H5V8ZM13 8H11V6H13V8ZM3 6H1V4H3V6ZM15 6H13V4H15V6Z"
      fill="currentColor"
    />
  </svg>
}