import S from "./index.module.scss";
import Button from "@/components/Button";
import WarningIcon from "@/assets/posts/warning.svg";
import Modal from "@/components/Modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import cx from "classnames";

const CancelOperation = (props: {
  disabled?: boolean
  className?: string
}) => {
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  return <>
    <Button
      className={cx(S.cancel, props.className)}
      disabled={props.disabled}
      onClick={() => setVisible(true)}
    >取消</Button>

    <Modal visible={visible} onVisibleChange={setVisible}>
      <div className={S.modal}>
        <div className={S.info}>
          <WarningIcon />
          确定取消内容？取消不保留内容。有重要内容，请先备份哦！
        </div>
        <div className={S.modalFooter}>
          <Button type='primary' onClick={() => router.back()}>先不发了</Button>
          <Button onClick={() => setVisible(false)}>再想想</Button>
        </div>
      </div>
    </Modal>
  </>
}

export default CancelOperation;