'use client'

import S from './index.module.scss'
import { useRef } from "react";
import useDeviceType from "@/hooks/useDeviceType";

const MouseToolTip = (props: {
  children?: React.ReactNode;
  open?: boolean
  message?: string
}) => {
  const tipsRef = useRef<HTMLDivElement>(null)
  const {} = useDeviceType()

  const handleMouseMove = (e) => {
    if (tipsRef.current) {
      tipsRef.current.style.left = e.nativeEvent.x - 8 + 'px';
      tipsRef.current.style.top = e.nativeEvent.y + 20 + 'px';
    }
  };

  const mouseEnter = (e) => {
    console.log('e>>>>>', e)
    if (!tipsRef.current || !props.open) return
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
    className={S.wrap}
    onMouseEnter={mouseEnter}
    onMouseLeave={mouseLeave}
    onMouseMove={handleMouseMove}
  >
    {props.children}

    <div className={S.tips} ref={tipsRef}>
      {props.message || '有 Web5 did 账号才可发帖，请先创建账号～'}
    </div>
  </div>
}

export default MouseToolTip;