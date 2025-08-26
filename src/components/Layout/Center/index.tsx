'use client'

import S from './index.module.scss'
import cx from "classnames";
import { useMemo } from "react";

export const LayoutCenter = (props: {
  children: React.ReactNode;
  className?: string;
}) => {

  const isMobile = useMemo(() => {
    const deviceType = document.body.style.getPropertyValue('--device-type');
    return deviceType === 'mobile';
  }, [])

  return <div className={cx(isMobile ? S.mobileContainer :S.container, props.className)}>
    {props.children}
  </div>
}