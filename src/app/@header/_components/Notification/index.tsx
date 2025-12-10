import { useEffect, useRef } from "react";
import MouseToolTip from "@/components/MouseToolTip";
import S from "./index.module.scss";
import NotificationIcon from "@/assets/header/notification.svg";
import NotificationPopOver from "./PopOver";
import { useBoolean } from "ahooks";
import { usePathname } from "next/navigation";
import cx from "classnames";

const Notification = () => {
  const [visible, setVisible] = useBoolean(false)
  const targetRef = useRef<HTMLDivElement>(null);

  const targetHref = '/notification'

  const pathname = usePathname()

  const onClick = () => {
    if (pathname !== targetHref) {
      setVisible.toggle()
    }
  }

  return <>
    <MouseToolTip message={'消息通知'} tipClassName={S.mouseTips}>
      <div className={cx(S.icon, pathname === targetHref && S.active)} ref={targetRef} onClick={onClick}>
        <NotificationIcon />
      </div>
    </MouseToolTip>

    {visible && <NotificationPopOver
      position={{
        top: targetRef.current?.getBoundingClientRect().bottom,
      }}
    />}
  </>
}

export default Notification;