'use client'

import S from './index.module.scss'
import cx from "classnames";
import useDeviceType from "@/hooks/useDeviceType";

export const LayoutCenter = (props: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {

  const { isMobile } = useDeviceType()

  return <div style={props.style} className={cx(isMobile ? S.mobileContainer :S.container, props.className)}>
    {props.children}
  </div>
}