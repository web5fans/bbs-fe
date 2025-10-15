import ConfirmModal from "@/components/Modal/ConfirmModal";
import S from "./index.module.scss";
import TextArea from "@/components/TextArea";
import { useEffect, useRef, useState } from "react";

 export default function HidePostOrCommentModal(props: {
   visible: boolean;
   onClose: () => void;
   onConfirm: (reason: string) => void;
 }) {
   const { visible, onClose, onConfirm } = props;
   const [reason, setReason] = useState('')

   useEffect(() => {
     if (!visible) setReason('')
   }, [visible]);

  return  <ConfirmModal
    lockScroll={false}
    visible={visible}
    message={'确定隐藏？请输入隐藏理由'}
    modalClassName={S.wrap}
    footer={{
      confirm: {
        text: '确定',
        onClick: () => onConfirm(reason),
        disabled: !reason
      },
      cancel: {
        text: '再想想',
        onClick: onClose
      }
    }}
  >
    <div className={S.textAreaWrap}>
      <TextArea onChange={setReason} />
    </div>
  </ConfirmModal>
}