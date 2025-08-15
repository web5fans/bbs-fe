import S from './index.module.scss'
import cx from "classnames";

export const LayoutCenter = (props: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cx(S.container, props.className)}>
    {props.children}
  </div>
}