import { ModalInfoType, usePostCommentReply } from "@/provider/PostReplyProvider";
import { useEffect, useRef, useState } from "react";

export default function useDetectPostCommentReply(props: {
  whenOpenSecondModal: () => void
}) {
  const { visible: providerVis, closeModal, modalInfo: providerModalInfo} = usePostCommentReply()
  const [modalMainInfo, setModalMainInfo] = useState<{ visible: boolean; info?: ModalInfoType }>({
    visible: false,
    info: undefined
  })

  const afterConfirmCloseTask = useRef<(() => void )| undefined>(undefined)

  useEffect(() => {
    if (providerVis && modalMainInfo.visible && !!providerModalInfo && providerModalInfo !== modalMainInfo.info ) {
      afterConfirmCloseTask.current = () => {
        setModalMainInfo({
          visible: true,
          info: providerModalInfo,
        })
      }
      props.whenOpenSecondModal()
    } else {
      setModalMainInfo({
        visible: providerVis,
        info: providerModalInfo,
      })
    }

  }, [providerVis, providerModalInfo]);


  const close = () => {
    if (afterConfirmCloseTask.current) {
      setModalMainInfo({
        visible: false,
      })
      setTimeout(() => {
        afterConfirmCloseTask.current?.()
        afterConfirmCloseTask.current = undefined
      }, 100)
    } else {
      closeModal()
    }
  }

  return {
    visible: modalMainInfo.visible,
    modalInfo: modalMainInfo.info,
    closeModal: close,
    clearCloseTask: () => afterConfirmCloseTask.current = undefined
  }
}