import S from './index.module.scss'
import LikeIcon from '@/assets/posts/like.svg';
import { useEffect, useState } from "react";
import { postsWritesPDSOperation } from "@/app/posts/utils";
import cx from "classnames";
import useCurrentUser from "@/hooks/useCurrentUser";
import { eventBus } from "@/lib/EventBus";

const PostLike = (props: {
  likeCount: string
  uri: string
  sectionId: string
  liked?: boolean
  showLikeList?: () => void
}) => {
  const { userProfile } = useCurrentUser();
  const [count, setCount] = useState(Number(props.likeCount) || 0)
  const [hasLiked, setHasLiked] = useState(props.liked)

  const [clickActive, setClickActive] = useState(false)

  useEffect(() => {
    setCount(Number(props.likeCount) || 0)
  }, [props.likeCount]);

  useEffect(() => {
    setHasLiked(props.liked)
  }, [props.liked]);

  const handleLike = async () => {
    if (!userProfile || hasLiked || clickActive) return
    setClickActive(true)
    await postsWritesPDSOperation({
      record: {
        $type: 'app.bbs.like',
        to: props.uri,
        section_id: props.sectionId,
      },
      did: userProfile.did
    })
    setCount(v => v + 1)
    eventBus.publish('post-like-list-refresh', props.uri)
  }

  const disabled = !userProfile || hasLiked

  return <div className={S.wrap}>
    <div className={cx(S.iconWrap, disabled && S.disabled, hasLiked && S.liked, clickActive && S.active)} onClick={handleLike}>
      <LikeIcon className={cx(S.icon)} />
    </div>
    <span className={S.count} onClick={() => {
      if (count === 0) return
      props.showLikeList?.()
    }}>{count}</span>
  </div>
}

export default PostLike;