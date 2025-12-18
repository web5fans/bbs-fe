import S from './index.module.scss'
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { cloneElement, JSX } from "react";

type ButtonProps = {
  text?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const ManageModal = (props: {
  visible: boolean;
  footer?: {
    confirm?: ButtonProps
    cancel?: ButtonProps
  }
  children: React.ReactNode;
  title: string
}) => {
  const { title, visible, footer, children } = props;

  return <Modal onlyMask visible={visible}>
    <div className={S.wrap}>
      <div className={S.header}>
        {title}
      </div>
      <div className={S.content}>
        {children}

        <div className={S.footer}>
          <Button
            type={'primary'}
            className={`${S.button} ${footer?.confirm?.className}`}
            disabled={footer?.confirm?.disabled}
            onClick={footer?.confirm?.onClick}
          >{footer?.confirm?.text || '确认'}</Button>
          <Button
            className={`${S.button} ${footer?.cancel?.className}`}
            disabled={footer?.cancel?.disabled}
            onClick={footer?.cancel?.onClick}
          >{footer?.cancel?.text || '取消'}</Button>
        </div>
      </div>
    </div>
  </Modal>
}

export default ManageModal;

export function FormItem(props: {
  title: string
  children: JSX.Element
  className?: string
}) {
  return <div className={`${S.formItem} ${props.className}`}>
    <p className={S.label}>{props.title}</p>
    {cloneElement(props.children, {
      isFormChild: true
    })}
  </div>
}