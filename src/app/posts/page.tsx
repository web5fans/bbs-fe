'use client'

import S from './index.module.scss'
import NoticeBoard from "@/app/posts/_components/NoticeBoard";
import SectionArea from "@/app/posts/_components/SectionArea";
import PostsList from "@/app/posts/_components/PostsList";
import PublishPost from "@/app/posts/_components/PublishPost";
import { EmptyPostsList } from "@/components/Empty";
import { useRouter } from "next/navigation";
import { LayoutCenter } from "@/components/Layout";
import SectionAreaMobile from "@/app/posts/_components/SectionArea/mobile";
import useDeviceFlex from "@/hooks/useDeviceFlex";
import PublishPostMobile from "./_components/PublishPost/mobile";
import KeyQRCodeModal from "@/app/user-center/_components/KeyQRCodeModal";

const BREAKPOINT_WIDTH = 1024;

const PostsHome = () => {
  const router = useRouter()
  const { clientWidth } = useDeviceFlex()

  const isUnderBreakPoint = clientWidth < BREAKPOINT_WIDTH

  return <LayoutCenter>
    <div className={S.wrap}>
      <div className={S.left}>
        <NoticeBoard />
        {isUnderBreakPoint && <SectionAreaMobile />}
        <PostsList
          headerExtra={isUnderBreakPoint && <PublishPostMobile />}
          listEmptyRender={<EmptyPostsList goPublish={() => router.push('/posts/publish')} />}
        />
      </div>
      <div className={S.right}>
        <PublishPost />
        {!isUnderBreakPoint && <SectionArea />}
      </div>
    </div>
  </LayoutCenter>
}

export default PostsHome;