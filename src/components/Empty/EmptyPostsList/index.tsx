'use client'

import S from './index.module.scss'
import Button from "@/components/Button";
import useCurrentUser from "@/hooks/useCurrentUser";
import cx from "classnames";
import { useRegisterPopUp } from "@/provider/RegisterPopUpProvider";

export function EmptyPostsList(props: {
  goPublish?: () => void
  className?: string
  message?: string
}) {
  const { isWhiteUser, hasLoggedIn } = useCurrentUser()

  const { openRegisterPop } = useRegisterPopUp()

  const defaultMsg = hasLoggedIn ? '暂无帖子，快去抢占本版区沙发吧！' : '注册账号，成为BBS论坛用户发布讨论吧'

  return <div className={cx(S.empty, props.className)}>
    <img src={'/assets/wink.png'} alt={'wink'} />
    <p className={S.emptyTip}>{props.message || defaultMsg}</p>
    {
      !hasLoggedIn ? <Button
        type={'primary'}
        className={S.emptyButton}
        onClick={openRegisterPop}
      >立刻创建</Button> : <Button
        type={'primary'}
        disabled={!isWhiteUser}
        className={S.emptyButton}
        onClick={props.goPublish}
      >去发布</Button>
    }
  </div>
}