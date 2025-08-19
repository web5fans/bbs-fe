'use client'

import S from './index.module.scss'
import SectionDetailCard from "@/app/section/[sectionId]/_components/SectionDetailCard";
import Recommend from "@/app/section/[sectionId]/_components/Recommend";
import FloatingMark, { useFloatingMarkDistance } from "@/components/FloatingMark";
import Button from "@/components/Button";
import { useParams, useRouter } from "next/navigation";
import PostsList from "@/app/posts/_components/PostsList";
import cx from "classnames";
import useUserInfoStore from "@/store/userInfo";

const SectionDetailPage = () => {
  const { sectionId } = useParams<{ sectionId: string }>()

  const { userInfo } = useUserInfoStore()

  const router = useRouter()

  const { rootRef, stickyRef } = useFloatingMarkDistance()

  const goToPublish = () => {
    router.push('/posts/publish?section=' + sectionId)
  }

  return <div className={S.container}>
    <div className={S.inner} ref={rootRef}>
      <SectionDetailCard goToPublish={goToPublish} sectionId={sectionId} />

      <Recommend sectionId={sectionId} />
      <PostsList sectionId={sectionId} minLimit={20} />
    </div>
    <FloatingMark ref={stickyRef}>
      <Button type={'primary'} onClick={goToPublish} className={cx(S.sticky, !userInfo && '!hidden')}><AddIcon/></Button>
    </FloatingMark>
  </div>
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