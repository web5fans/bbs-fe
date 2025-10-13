import S from './index.module.scss'
import LockIcon from '@/assets/posts/op/lock.svg'
import UnLockIcon from '@/assets/posts/op/unlock.svg'
import { HTMLAttributes } from "react";
import cx from "classnames";


const SwitchPostHideOrOpen = (props: {
  status: 'open' | 'hide'
} & HTMLAttributes<HTMLParagraphElement>) => {
  const { status, className, ...rest } = props;

  if (status === 'open') {
    return <p className={cx(S.wrap, className)} {...rest}>
      <LockIcon />
      隐藏
    </p>
  }

  return <p className={cx(S.wrap, 'z-3',className)} {...rest}>
    <UnLockIcon />
    公开
  </p>
}

export default SwitchPostHideOrOpen;