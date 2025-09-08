import S from './index.module.scss'
import LikeIcon from '@/assets/posts/like.svg';
import { useState } from "react";
import { writesPDSOperation } from "@/app/posts/utils";
import cx from "classnames";
import useCurrentUser from "@/hooks/useCurrentUser";

const PostLike = (props: {
  likeCount: string
  uri: string
  sectionId: string
  liked?: boolean
}) => {
  const { userProfile } = useCurrentUser();
  const [count, setCount] = useState(Number(props.likeCount) || 0)
  const [hasLiked, setHasLiked] = useState(props.liked)

  const handleLike = async () => {
    if (!userProfile || hasLiked) return
    await writesPDSOperation({
      record: {
        $type: 'app.bbs.like',
        to: props.uri,
        section_id: props.sectionId,
      },
      did: userProfile.did
    })
    setHasLiked(true)
    setCount(v => v + 1)
  }

  const disabled = !userProfile || hasLiked

  return <div className={S.wrap}>
    <LikeIcon className={cx(S.icon, disabled && S.disabled, hasLiked && S.liked)} onClick={handleLike} />
    <span className={S.count}>{count}</span>
  </div>
}

export default PostLike;