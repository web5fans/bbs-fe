import Button from "@/components/Button";
import { useState } from "react";
import cx from "classnames";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { useRouter } from "next/navigation";

const CancelOperation = (props: {
  disabled?: boolean
  className?: string
  saveDraft: () => void
  deleteDraft: () => void
}) => {
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  return <>
    <Button
      className={cx(props.className)}
      disabled={props.disabled}
      onClick={() => setVisible(true)}
    >取消</Button>

    <ConfirmModal
      visible={visible}
      message={'确定取消内容？有重要内容，可以先存草稿哦！'}
      footer={{
        confirm: {
          text: '存草稿',
          onClick: () => {
            props.saveDraft()
            setVisible(false)
            router.back()
          }
        },
        cancel: {
          text: '删除内容',
          onClick: () => {
            props.deleteDraft()
            setVisible(false)
            router.back()
          }
        }
      }}
    />
  </>
}

export default CancelOperation;