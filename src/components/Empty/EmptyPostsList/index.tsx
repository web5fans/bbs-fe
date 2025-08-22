'use client'

import S from './index.module.scss'
import Button from "@/components/Button";
import useCurrentUser from "@/hooks/useCurrentUser";
import cx from "classnames";

export function EmptyPostsList(props: {
  goPublish?: () => void
  className?: string
  message?: string
}) {
  const { isWhiteUser } = useCurrentUser()

  return <div className={cx(S.empty, props.className)}>
    <img src={'/assets/wink.png'} alt={'wink'} />
    <p className={S.emptyTip}>{props.message || '暂无帖子，快去抢占本版区沙发吧！'}</p>
    {props.goPublish && <Button
      type={'primary'}
      disabled={!isWhiteUser}
      className={S.emptyButton}
      onClick={props.goPublish}
    >去发布</Button>}
  </div>
}