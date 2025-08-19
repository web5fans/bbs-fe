'use client'

import S from './index.module.scss'
import cx from "classnames";
import { HTMLAttributes } from "react";

type ButtonProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'primary' | 'normal';
  disabled?: boolean;
} & HTMLAttributes<HTMLDivElement>

const Button = (props: ButtonProps) => {
  const {
    children,
    className,
    onClick,
    type = 'normal',
    disabled,
    ...rest
  } = props;

  return <div
    {...rest}
    className={cx(S.button, className, type === 'primary' && S.primary, disabled && S.disabled)}
    onClick={(e) => {
      if (disabled) return
      onClick?.(e)
    }}
  >
    <div className={S.shadow} />
    <div className={S.inner}>
      {children}
    </div>
  </div>
}

export default Button;