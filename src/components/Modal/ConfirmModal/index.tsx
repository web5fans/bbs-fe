import S from "./index.module.scss";
import WarningIcon from "@/assets/posts/warning.svg";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

type ConfirmModalProps = {
  visible: boolean;
  onVisibleChange?: (visible: boolean) => void;
  message: string;
  lockScroll?: boolean
  footer: {
    confirm: {
      text: string;
      onClick: () => void;
    },
    cancel: {
      text: string;
      onClick: () => void;
    }
  }
}

const ConfirmModal = (props: ConfirmModalProps) => {
  const { visible, onVisibleChange, message, footer } = props;
  const { confirm, cancel } = footer

  return <Modal visible={visible} onVisibleChange={onVisibleChange} lockScroll={props.lockScroll}>
    <div className={S.modal}>
      <div className={S.info}>
        <WarningIcon className={S.warningIcon} />
        {message}
      </div>
      <div className={S.modalFooter}>
        <Button type='primary' onClick={() => confirm.onClick()}>{confirm.text}</Button>
        <Button onClick={() => cancel.onClick()}>{cancel.text}</Button>
      </div>
    </div>
  </Modal>
}

export default ConfirmModal;