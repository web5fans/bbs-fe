'use client'

import S from './index.module.scss'
import SectionDetailCard from "./_components/SectionDetailCard";
import Recommend from "./_components/Recommend";
import FloatingMark, { useFloatingMarkDistance } from "@/components/FloatingMark";
import Button from "@/components/Button";
import { useParams, useRouter } from "next/navigation";
import PostsList from "@/app/posts/_components/PostsList";
import cx from "classnames";
import { EmptyPostsList } from "@/components/Empty";
import useCurrentUser from "@/hooks/useCurrentUser";
import { LayoutCenter } from "@/components/Layout";
import { useCallback, useRef } from "react";
import Permission from "@/app/posts/[postId]/_components/Permission";
import { useRequest } from "ahooks";
import server from "@/server";
import { SectionItem } from "@/app/posts/utils";
import SettingIcon from "@/assets/posts/setting.svg";
import GoPublishPost from "./_components/GoPublishPost";
import useDeviceFlex from "@/hooks/useDeviceFlex";
import GoPublishPostMobile from "./_components/GoPublishPost/mobile";
import FundEntrance from "./_components/FundEntrance";

const BREAKPOINT_WIDTH = 1024;

const SectionDetailPage = () => {
  const { sectionId } = useParams<{ sectionId: string }>()

  const { isWhiteUser } = useCurrentUser()

  const router = useRouter()

  const { rootRef, stickyRef } = useFloatingMarkDistance()

  const recommendRef = useRef<{ reload: () => void }>(null)

  const { data: sectionInfo, refresh: refreshSection } = useRequest(async () => {
    return await server<SectionItem>('/section/detail', 'GET', {
      id: sectionId
    })
  }, {
    ready: !!sectionId,
    refreshDeps: [sectionId]
  })

  const goToPublish = () => {
    router.push('/posts/publish?section=' + sectionId)
  }

  const feedItemHeaderOpts = useCallback((postItem: any, hover: boolean, reload) => {
    return <Permission
      sectionInfo={sectionInfo}
      originPost={postItem}
      closeDropDown={!hover}
      trigger={<SettingIcon className={S.setting} />}
      refreshData={(type) => {
        if (type === 'announcement') recommendRef.current?.reload()
        refreshSection();
        reload()
      }}
    />
  }, [sectionInfo])

  const { clientWidth } = useDeviceFlex()

  const isUnderBreakPoint = clientWidth < BREAKPOINT_WIDTH

  return <LayoutCenter>
      <div
        className={S.container}
        ref={rootRef}
      >
        <div className={S.left}>
          <SectionDetailCard sectionInfo={sectionInfo} />
          {isUnderBreakPoint && <FundEntrance sectionId={sectionId} ckbAddr={sectionInfo?.ckb_addr} />}

          <Recommend sectionId={sectionId} ref={recommendRef} />
          <PostsList
            headerExtra={isUnderBreakPoint && <GoPublishPostMobile goPublish={goToPublish} />}
            sectionId={sectionId}
            listEmptyRender={<EmptyPostsList goPublish={goToPublish} />}
            feedItemHeaderOpts={feedItemHeaderOpts}
          />
        </div>
        <div className={S.right}>
          <GoPublishPost goPublish={goToPublish} />
          <FundEntrance sectionId={sectionId} ckbAddr={sectionInfo?.ckb_addr} />
        </div>
      </div>
      <FloatingMark ref={stickyRef}>
        <Button
          type={'primary'}
          onClick={goToPublish}
          className={cx(S.sticky, !isWhiteUser && '!hidden')}
        >
          <AddIcon /></Button>
      </FloatingMark>
  </LayoutCenter>
}

export default SectionDetailPage;

function AddIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M6.85742 5.14258H12V6.85742H6.85742V12H5.14258V6.85742H0V5.14258H5.14258V0H6.85742V5.14258Z"
      fill="white"
    />
  </svg>
}