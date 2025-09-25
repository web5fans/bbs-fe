'use client'

import S from './index.module.scss'
import { HTMLAttributes, useRef } from "react";
import cx from "classnames";

const MouseToolTip = (props: {
  children?: React.ReactNode;
  open?: boolean
  message?: string
  tipClassName?: string
} & HTMLAttributes<HTMLDivElement>) => {
  const { open = true, children, message, tipClassName, ...rest } = props;
  const tipsRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e) => {
    if (tipsRef.current) {
      tipsRef.current.style.left = e.nativeEvent.x - 8 + 'px';
      tipsRef.current.style.top = e.nativeEvent.y + 20 + 'px';
    }
  };

  const mouseEnter = (e) => {
    if (!tipsRef.current || !open) return
    if (tipsRef.current) {
      tipsRef.current.style.left = e.nativeEvent.x + 'px';
      tipsRef.current.style.top = e.nativeEvent.y + 'px';
    }
    tipsRef.current.style.display = 'block'
  }

  const mouseLeave = () => {
    if (!tipsRef.current) return
    tipsRef.current.style.display = 'none'
  }

  return <div
    {...rest}
    className={S.wrap}
    onMouseEnter={mouseEnter}
    onMouseLeave={mouseLeave}
    onMouseMove={handleMouseMove}
  >
    {props.children}

    <div className={cx(S.tips, tipClassName)} ref={tipsRef}>
      {props.message || '有 Web5 did 账号才可发帖，请先创建账号～'}
    </div>
  </div>
}

export default MouseToolTip;