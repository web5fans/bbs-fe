import S from "./index.module.scss";
import WarningIcon from "@/assets/posts/warning.svg";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import cx from "classnames";

type ConfirmModalProps = {
  visible: boolean;
  onVisibleChange?: (visible: boolean) => void;
  message: string;
  lockScroll?: boolean
  footer?: {
    confirm?: {
      text: string;
      onClick: () => void;
      disabled?: boolean;
    },
    cancel?: {
      text?: string;
      onClick: () => void;
      disabled?: boolean;
    }
  }
  children?: React.ReactNode;
  modalClassName?: string;
}

const ConfirmModal = (props: ConfirmModalProps) => {
  const { visible, onVisibleChange, message, footer } = props;
  const { confirm, cancel } = footer || {};

  return <Modal visible={visible} onVisibleChange={onVisibleChange} lockScroll={props.lockScroll}>
    <div className={cx(S.modal, props.modalClassName)}>
      <div className={S.info}>
        <WarningIcon className={S.warningIcon} />
        {message}
      </div>
      {props.children}
      <div className={S.modalFooter}>
        {confirm && <Button
          type='primary'
          onClick={() => confirm.onClick()}
          disabled={confirm.disabled}
        >{confirm.text}</Button>}
        {cancel && <Button onClick={() => cancel.onClick()} disabled={cancel.disabled}>{cancel.text || '取消'}</Button>}
      </div>
    </div>
  </Modal>
}

export default ConfirmModal;