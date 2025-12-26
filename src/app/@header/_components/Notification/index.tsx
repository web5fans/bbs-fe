'use client'

import { useEffect, useRef } from "react";
import MouseToolTip from "@/components/MouseToolTip";
import S from "./index.module.scss";
import NotificationIcon from "@/assets/header/notification.svg";
import NotificationPopOver from "./PopOver";
import { useBoolean } from "ahooks";
import { usePathname, useRouter } from "next/navigation";
import cx from "classnames";
import useNotify from "@/store/notification";

const targetHref = '/notification'

const Notification = () => {
  const [visible, setVisible] = useBoolean(false)
  const wrapRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname()
  const router = useRouter()

  const { isHasUnReadNotify, startPolling, stopPolling } = useNotify()

  useEffect(() => {
    startPolling()
    return () => {
      stopPolling()
    }
  }, []);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setVisible.setFalse()
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onClick = () => {
    if (pathname !== targetHref) {
      if (window.innerWidth < 768) {
        router.push(targetHref)
        return
      }
      setVisible.toggle()
    }
  }

  return <div ref={wrapRef}>
    <MouseToolTip message={'消息通知'} tipClassName={S.mouseTips} open={!visible}>
      <div className={cx(S.icon, pathname === targetHref && S.active)} ref={targetRef} onClick={onClick}>
        <NotificationIcon />
        {isHasUnReadNotify && <span className={S.unread} />}
      </div>
    </MouseToolTip>

    {visible && <NotificationPopOver
      position={{
        top: targetRef.current?.getBoundingClientRect().bottom,
      }}
    />}
  </div>
}

export default Notification;