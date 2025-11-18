import S from './index.module.scss'
import LockIcon from '@/assets/posts/op/lock.svg'
import UnLockIcon from '@/assets/posts/op/unlock.svg'
import { HTMLAttributes } from "react";
import cx from "classnames";
import { useBoolean } from "ahooks";
import HidePostOrCommentModal from "@/app/posts/[postId]/_components/HidePostOrCommentModal";
import { PostOptParamsType, updatePostByAdmin } from "@/app/posts/utils";
import { useSection } from "../../../Post404Auth";


const SwitchPostHideOrOpen = (props: {
  status: 'open' | 'hide';
  uri: string
  onConfirm: () => void
  className?: string
  nsid: 'comment' | 'reply'
}) => {
  const { status, className, uri, onConfirm, nsid } = props;
  const [hideModalVis, { toggle: toggleHideModalVis, setFalse: closeHideModal }] = useBoolean(false)
  const { isSectionAdmin } = useSection()

  const handlePostsOpt = async (reason?: string) => {
    const obj: PostOptParamsType = {
      nsid: nsid === 'comment' ? 'app.bbs.comment' : 'app.bbs.reply',
      uri: uri,
      is_disabled: status === 'hide',
      reasons_for_disabled: reason
    }
    await updatePostByAdmin(obj)
    onConfirm()
  }

  if (!isSectionAdmin) return null

  if (status === 'hide') {
    return <>
      <p className={cx(S.wrap, className)} onClick={toggleHideModalVis}>
        <LockIcon />
        隐藏
      </p>
      <HidePostOrCommentModal
        visible={hideModalVis}
        onClose={closeHideModal}
        onConfirm={(reason) => {
          handlePostsOpt(reason)
          closeHideModal()
        }}
      />
    </>
  }

  return <p className={cx(S.wrap, 'z-3', className)} onClick={() => handlePostsOpt()}>
    <UnLockIcon />
    公开
  </p>
}

export default SwitchPostHideOrOpen;