'use client'

import { useEffect } from "react";
import useUserInfoStore from "@/store/userInfo";
import useDeviceFlex from "@/hooks/useDeviceFlex";

import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc'
import dayjs from "dayjs";

dayjs.extend(duration)
dayjs.extend(utc);

const MainContent = (props: {
  children: React.ReactNode;
  deviceType?: string;
}) => {
  const { initialize, initialized } = useUserInfoStore();
  const { centerWidth, isUseDoubleSize } = useDeviceFlex()

  useEffect(() => {
    document.documentElement.style.visibility = 'visible';
  }, []);

  useEffect(() => {
    initialize()
  }, []);

  useEffect(() => {
    document.body.style.setProperty('--device-type', props.deviceType || '');
    document.body.style.setProperty('--center-content-width', centerWidth + 'px');
    document.body.style.setProperty('--flexible-design-size', !isUseDoubleSize ? '375' : '16');
    document.body.style.setProperty('--flexible-size-unit', !isUseDoubleSize ? '100vw' : '2rem');

  }, [centerWidth, isUseDoubleSize]);

  if (!initialized) return null;

  return <div className={'flex flex-col'}>
    {props.children}
  </div>
}

export default MainContent;