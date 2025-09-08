import S from "./index.module.scss";
import PostLike from "@/app/posts/[postId]/_components/PostLike";
import utcToLocal from "@/lib/utcToLocal";
import Avatar from "@/components/Avatar";

const PostItemFooter = (props: {
  postInfo: any
  sectionId: string
  floor: number
}) => {
  const { postInfo, sectionId, floor } = props;

  return <div>
    <div className={S.floor}>
      <PostLike
        likeCount={postInfo.like_count}
        uri={postInfo.uri}
        sectionId={sectionId}
      />
      <span>{utcToLocal(postInfo.created, 'YYYY/MM/DD HH:mm:ss')}</span>
      <span>{floor}楼</span>
    </div>

    {/*<div className={S.likedDetail}>*/}
    {/*  {*/}
    {/*    new Array(17).fill(0).map(() => <Avatar nickname={'CCC'} className={S.likedAvatar} />)*/}
    {/*  }*/}
    {/*</div>*/}
  </div>
}

export default PostItemFooter;