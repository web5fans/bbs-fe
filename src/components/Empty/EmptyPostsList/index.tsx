'use client'

import S from './index.module.scss'
import Button from "@/components/Button";
import useCurrentUser from "@/hooks/useCurrentUser";

export function EmptyPostsList(props: { goPublish: () => void }) {
  const { isWhiteUser } = useCurrentUser()

  return <div className={S.empty}>
    <img src={'/assets/wink.png'} alt={'wink'} />
    <p className={S.emptyTip}>暂无帖子，快去抢占本版区沙发吧！</p>
    <Button
      type={'primary'}
      disabled={!isWhiteUser}
      className={S.emptyButton}
      onClick={props.goPublish}>去发布</Button>
  </div>
}