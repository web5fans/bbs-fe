import S from './index.module.scss'
import NoticeBoard from "@/app/posts/_components/NoticeBoard";
import SectionArea from "@/app/posts/_components/SectionArea";
import PostsList from "@/app/posts/_components/PostsList";
import PublishPost from "@/app/posts/_components/PublishPost";

const PostsHome = () => {
  return <div className={S.container}>
    <div className={S.wrap}>
      <div className={S.left}>
        <NoticeBoard />
        <PostsList />
      </div>
      <div className={S.right}>
        <PublishPost />
        <SectionArea />
      </div>
    </div>
  </div>
}

export default PostsHome;