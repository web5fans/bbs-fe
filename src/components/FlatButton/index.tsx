import { ReactNode } from "react";
import S from './index.module.scss'
import cx from "classnames";

const FlatButton = (props: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean
}) => {
  return <div
    className={cx(
      S.wrap,
      props.disabled && S.disabled,
      props.active && S.active,
      props.className,
    )}
    onClick={props.onClick}
  >
    {props.children}
  </div>
}

export default FlatButton;