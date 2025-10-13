'use client'

import CardWindow from "@/components/CardWindow";
import S from './index.module.scss'
import FeedStatistic from "@/components/FeedStatistic";
import Button from "@/components/Button";
import MouseToolTip from "@/components/MouseToolTip";
import { useEffect, useRef, useState } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useRequest } from "ahooks";
import server from "@/server";
import { SectionItem } from "@/app/posts/utils";
import useCurrentUser from "@/hooks/useCurrentUser";
import useMediaQuery from "@/hooks/useMediaQuery";
import SectionInfo from "@/app/section/[sectionId]/_components/SectionDetailCard/SectionInfo";

const SPLIT_NUMBER = 145

const SectionDetailCard = (props: {
  goToPublish: () => void
  sectionInfo?: SectionItem
}) => {
  const { sectionInfo } = props;
  const { hasLoggedIn, isWhiteUser } = useCurrentUser()
  const [expand, setExpand] = useState(false)
  const infoRef = useRef<HTMLDivElement>(null);

  const needSplit = (sectionInfo?.description?.length || 0) > SPLIT_NUMBER

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
    <div className={S.innerWrap}>
      <SectionInfo sectionInfo={sectionInfo}>
        <div
          className={S.content}
          ref={infoRef}
        >
          {renderInfo()}
        </div>
      </SectionInfo>

      <MouseToolTip
        open={!isWhiteUser}
        message={hasLoggedIn && !isWhiteUser ? '暂时只有白名单用户可以发帖，可返回首页申请开通' : ''}>
        <div className={S.buttonWrap}>
          <Button
            type={'primary'}
            className={S.button}
            disabled={!isWhiteUser}
            onClick={props.goToPublish}
          >
            <PlusIcon className={S.plus} />发布讨论
          </Button>
        </div>
      </MouseToolTip>
    </div>


  </CardWindow>
}

export default SectionDetailCard;

function PlusIcon(props: { className?: string }) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={props.className}
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