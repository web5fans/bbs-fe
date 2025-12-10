import S from "./index.module.scss";
import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import TextHoverFocus from "@/components/TextHoverFocus";
import Link from "next/link";

type NotificationPopOverProps = {
  position: {
    top?: number
  }
}

const NotificationPopOver = (props: NotificationPopOverProps) => {

  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const { top } = props.position
    if (!popoverRef.current) return

    popoverRef.current.style.top = `${top - 2}px`;

  }, [props.position]);

  return <div ref={popoverRef} className={S.popover}>
    <p className={S.header}>
      <span className={S.title}>消息通知</span>
      <a className={S.readAll}>全部已读</a>
    </p>
    <div className={S.content}>
      <MessageItem />
      <MessageItem />
      <MessageItem />
      <MessageItem />
      <MessageItem />
      <MessageItem />
      <MessageItem />
    </div>
    <Link href={'/notification'} prefetch className={'flex items-center justify-center'}>
      <TextHoverFocus text={'查看全部'} classnames={{ wrap: S.checkAll }} />
    </Link>
  </div>
}

export default NotificationPopOver;