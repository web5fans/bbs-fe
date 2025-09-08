import S from "./index.module.scss";
import Button from "@/components/Button";
import WarningIcon from "@/assets/posts/warning.svg";
import Modal from "@/components/Modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import cx from "classnames";

const CancelButton = (props: {
  disabled?: boolean
  className?: string
}) => {
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  return <>
    <Button
      className={cx(props.className)}
      disabled={props.disabled}
      onClick={() => setVisible(true)}
    >取消</Button>

    <Modal visible={visible} onVisibleChange={setVisible}>
      <div className={S.modal}>
        <div className={S.info}>
          <WarningIcon className={S.warningIcon} />
          确定放弃编辑？本次修改的内容将会丢失，原帖内容保持不变。
        </div>
        <div className={S.modalFooter}>
          <Button type='primary' onClick={() => setVisible(false)}>继续编辑</Button>
          <Button onClick={() => router.back()}>放弃修改</Button>
        </div>
      </div>
    </Modal>
  </>
}

export default CancelButton;