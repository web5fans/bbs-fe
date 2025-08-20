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
  showClickAnimate?: boolean
} & HTMLAttributes<HTMLDivElement>

const Button = (props: ButtonProps) => {
  const {
    children,
    className,
    onClick,
    type = 'normal',
    disabled,
    showClickAnimate = true,
    ...rest
  } = props;

  return <div
    {...rest}
    className={cx(S.button, showClickAnimate && S.showClickAni, className, type === 'primary' && S.primary, disabled && S.disabled)}
    onClick={(e) => {
      if (disabled) return
      onClick?.(e)
    }}
  >
    {children}
  </div>
}

export default Button;