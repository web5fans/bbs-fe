'use client'

import { useEffect } from "react";
import useUserInfoStore from "@/store/userInfo";
import useDeviceFlex from "@/hooks/useDeviceFlex";

import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import "./index.scss";

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(utc);
dayjs.locale('zh-cn'); // 设置为中文

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
    document.documentElement.style.setProperty('--device-type', props.deviceType || '');
    document.documentElement.style.setProperty('--center-content-width', centerWidth + 'px');
    document.documentElement.style.setProperty('--flexible-design-size', !isUseDoubleSize ? '375' : '16');
    document.documentElement.style.setProperty('--flexible-size-unit', !isUseDoubleSize ? '100vw' : '2rem');

  }, [centerWidth, isUseDoubleSize]);

  if (!initialized) return null;

  return <div className={'flex flex-col'}>
    {props.children}
  </div>
}

export default MainContent;