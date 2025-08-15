'use client'

import S from './index.module.scss'
import SectionDetailCard from "@/app/section/[sectionId]/_components/SectionDetailCard";
import Recommend from "@/app/section/[sectionId]/_components/Recommend";
import { useEffect, useRef } from "react";
import FloatingMark from "@/components/FloatingMark";
import Button from "@/components/Button";
import { useParams, useRouter } from "next/navigation";
import PostsList from "@/app/posts/_components/PostsList";

const SectionDetailPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const { sectionId } = useParams<{ sectionId: string }>()

  const router = useRouter()

  useEffect(() => {
    const instance = contentRef.current;
    if (!instance) return

    const left = instance.offsetLeft + instance.clientWidth + 16

    stickyRef.current.style.left = left + 'px'

  }, []);

  const goToPublish = () => {
    router.push('/posts/publish?section=' + sectionId)
  }

  return <div className={S.container}>
    <div className={S.inner} ref={contentRef}>
      <SectionDetailCard goToPublish={goToPublish} sectionId={sectionId} />

      <Recommend sectionId={sectionId} />
      <PostsList sectionId={sectionId} />
    </div>
    <FloatingMark ref={stickyRef}>
      <Button type={'primary'} onClick={goToPublish} className={S.sticky}><AddIcon/></Button>
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