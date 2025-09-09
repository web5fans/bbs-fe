import S from "./index.module.scss";
import PostLike from "@/app/posts/[postId]/_components/PostLike";
import utcToLocal from "@/lib/utcToLocal";
import LikeList from "./_components/LikeList";
import { useState } from "react";

const PostItemFooter = (props: {
  postInfo: any
  sectionId: string
  floor: number
}) => {
  const { postInfo, sectionId, floor } = props;
  const [ showType, setShowType ] = useState<'like' | 'reply' | undefined>(undefined)

  return <div>
    <div className={S.floor}>
      <PostLike
        liked={postInfo.liked}
        likeCount={postInfo.like_count}
        uri={postInfo.uri}
        sectionId={sectionId}
        showLikeList={() => {
          if (showType === 'like') {
            setShowType(undefined);
            return
          }
          setShowType("like")
        }}
      />
      <span>{utcToLocal(postInfo.created, 'YYYY/MM/DD HH:mm:ss')}</span>
      <span>{floor}楼</span>
    </div>

    {showType === 'like' && <LikeList uri={postInfo.uri} />}
  </div>
}

export default PostItemFooter;