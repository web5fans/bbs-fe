import S from './index.module.scss'
import cx from "classnames";

export function EmptyText(props: {
  className?: string
  message?: string
}) {

  return <div className={cx(S.empty, props.className)}>
    <img src={'/assets/wink.png'} alt={'wink'} />
    <p className={S.emptyTip}>{props.message}</p>
  </div>
}