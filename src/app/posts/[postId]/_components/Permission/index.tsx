import S from './index.module.scss'
import DropDown from "@/components/DropDown";
import { RefObject, useEffect, useMemo, useRef } from "react";
import SettingIcon from "@/assets/posts/setting.svg";
import Button from "@/components/Button";
import LockIcon from '@/assets/posts/op/lock.svg';
import UnLockIcon from '@/assets/posts/op/unlock.svg';
import StickyIcon from '@/assets/posts/op/sticky.svg';
import UnStickyIcon from '@/assets/posts/op/unshelf.svg';
import TopIcon from '@/assets/posts/op/top.svg';
import UnTopIcon from '@/assets/posts/op/un-top.svg';
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { calculateFixedDis } from "@/components/FloatingMark";
import HidePostOrCommentModal from "../HidePostOrCommentModal";
import { useBoolean } from "ahooks";
import { PostOptParamsType, updatePostByAdmin } from "@/app/posts/utils";
import useCurrentUser from "@/hooks/useCurrentUser";
import cx from "classnames";

const PostPermission = (props: {
  rootRef?: RefObject<HTMLDivElement | null>,
  originPost: {
    uri: string
    is_top?: boolean
    is_announcement?: boolean
    is_disabled?: boolean
  }
  admins?: string[]
  refreshData?: () => void
  trigger?: React.ReactNode
  className?: string
}) => {
  const { rootRef, originPost } = props;

  const [hideModalVis, { toggle: toggleHideModalVis, setFalse: closeHideModal }] = useBoolean(false)

  const ref = useRef<HTMLDivElement | null>(null);

  const { userProfile } = useCurrentUser()

  const changePostStatus = async (type: 'visible' | 'announcement' | 'top', hideReason?: string) => {
    if (type === 'visible' && !originPost.is_disabled && !hideReason) {
      toggleHideModalVis()
      return
    }

    const obj: PostOptParamsType = {
      uri: originPost.uri
    }
    switch (type) {
      case 'visible':
        obj['is_disabled'] = !originPost.is_disabled;
        obj['reasons_for_disabled'] = hideReason;
        break;
      case 'announcement':
        obj['is_announcement'] = !originPost.is_announcement;
        break;
      case 'top':
        obj['is_top'] = !originPost.is_top;
        break;
    }
    await updatePostByAdmin(obj)
    props.refreshData?.()
  }

  const popItems = useMemo(() => {
    if (!originPost) return []
    return [
      { name: <PopItem
          flag={originPost.is_disabled}
          name={['公开帖子', '隐藏帖子']}
          icon={[<UnLockIcon />, <LockIcon />]} />, onClick: () => changePostStatus('visible') },
      { name: <PopItem
          flag={originPost.is_announcement}
          name={['下架公告', '将帖子设为公告']}
          icon={[<UnStickyIcon />, <StickyIcon />]} />, onClick: () => changePostStatus('announcement') },
      { name: <PopItem
          flag={originPost.is_top}
          name={['取消置顶', '置顶帖子']}
          icon={[<UnTopIcon />, <TopIcon />]} />, onClick: () => changePostStatus('top') },
    ]
  }, [originPost])

  const needShow = useMemo(() => {
    if (!props.admins || !userProfile) return false;
    return props.admins.includes(userProfile.did)

  }, [props.admins, userProfile])

  useEffect(() => {
    if (!needShow) return;

    if (!ref.current || !rootRef || !rootRef.current) return;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        if (!ref.current || !rootRef.current) return;

        calculateFixedDis(rootRef.current, ref.current)
      })
    })

    observer.observe(rootRef.current)

    return () => {
      if (!rootRef || !rootRef.current) return
      observer.unobserve(rootRef.current)
    }

  }, [needShow]);

  if (!needShow) return null

  return <>
    <div
      className={cx(!props.trigger && S.wrap, props.className)}
      ref={ref}
    >
      <DropDown
        classNames={{ popOver: S.popOver }}
        popItems={popItems}
      >
        {props.trigger || <Button className={S.button}><SettingIcon /></Button>}
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

    <HidePostOrCommentModal
      visible={hideModalVis}
      onClose={closeHideModal}
      onConfirm={(reason) => {
        changePostStatus('visible', reason)
        closeHideModal()
      }}
    />
  </>
}

export default PostPermission;

function PopItem({ icon, name, flag }: {
  icon: [React.ReactNode, React.ReactNode];
  name: [string, string]
  flag?: boolean
}) {
  return <div className={S.popItem}>
    {flag ? icon[0] : icon[1]}
    {flag ? name[0] : name[1]}
  </div>
}