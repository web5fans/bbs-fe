import S from './index.module.scss'
import DropDown from "@/components/DropDown";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import SettingIcon from "@/assets/posts/setting.svg";
import Button from "@/components/Button";
import LockIcon from '@/assets/posts/op/lock.svg';
import StickyIcon from '@/assets/posts/op/sticky.svg';
import TopIcon from '@/assets/posts/op/top.svg';
import Modal from "@/components/Modal";
import WarningIcon from '@/assets/posts/warning.svg';
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { calculateFixedDis } from "@/components/FloatingMark";
import TextArea from "@/components/TextArea";

const PostPermission = (props: {
  rootRef: RefObject<HTMLDivElement | null>,
}) => {
  const { rootRef } = props;

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        if (!ref.current || !rootRef.current) return;

        calculateFixedDis(rootRef.current, ref.current)
      })
    })

    observer.observe(rootRef.current)

    return () => {
      if (!rootRef.current) return
      observer.unobserve(rootRef.current)
    }

  }, []);

  const popItems = useMemo(() => {
    return [
      { name: <PopItem name={'隐藏帖子'} icon={<LockIcon />} />, onClick: () => {} },
      { name: <PopItem name={'将帖子设为公告'} icon={<StickyIcon />} />, onClick: () => {} },
      { name: <PopItem name={'置顶帖子'} icon={<TopIcon />} />, onClick: () => {} },
    ]
  }, [])

  return <>
    <div
      className={S.wrap}
      ref={ref}
    >
      <DropDown
        classNames={{ popOver: S.popOver }}
        popItems={popItems}
      >
        <Button className={S.button}><SettingIcon /></Button>
      </DropDown>
    </div>
    <ConfirmModal
      visible={false}
      message={'最多只能置顶3个帖子，请移除一些置顶帖子后再尝试'}
      footer={{
        confirm: {
          text: '了解了',
          onClick: () => {}
        }
      }}
    />

    <HidePostModal />
  </>
}

export default PostPermission;

function PopItem({ icon, name }: {
  icon: React.ReactNode;
  name: string
}) {
  return <div className={S.popItem}>
    {icon}
    {name}
  </div>
}

function HidePostModal() {
  return  <ConfirmModal
    visible={false}
    message={'确定隐藏帖子？请输入隐藏理由，待超级管理员审核后，即可隐藏成功'}
    footer={{
      confirm: {
        text: '确定',
        onClick: () => {}
      },
      cancel: {
        text: '再想想',
        onClick: () => {}
      }
    }}
  >
    <div className={S.textAreaWrap}>
      <TextArea />
    </div>
  </ConfirmModal>
}