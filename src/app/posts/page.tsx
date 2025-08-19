'use client'

import S from './index.module.scss'
import NoticeBoard from "@/app/posts/_components/NoticeBoard";
import SectionArea from "@/app/posts/_components/SectionArea";
import PostsList from "@/app/posts/_components/PostsList";
import PublishPost from "@/app/posts/_components/PublishPost";
import { EmptyPostsList } from "@/components/Empty";
import { useRouter } from "next/navigation";

const PostsHome = () => {
  const router = useRouter()

  return <div className={S.container}>
    <div className={S.wrap}>
      <div className={S.left}>
        <NoticeBoard />
        <PostsList listEmptyRender={<EmptyPostsList goPublish={() => router.push('/posts/publish')} />} />
      </div>
      <div className={S.right}>
        <PublishPost />
        <SectionArea />
      </div>
    </div>
  </div>
}

export default PostsHome;