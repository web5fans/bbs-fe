'use client'

import S from './index.module.scss'
import cx from "classnames";
import useMediaQuery from "@/hooks/useMediaQuery";

export const LayoutCenter = (props: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {

  const { innerWidth } = useMediaQuery()
  const isMobile = innerWidth < 768;

  return <div style={props.style} className={cx(isMobile ? S.mobileContainer :S.container, props.className)}>
    {props.children}
  </div>
}