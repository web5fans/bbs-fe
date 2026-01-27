import { ReplyModalInfoType } from "@/provider/PostReplyProvider";
import { useEffect, useRef, useState } from "react";
import { ReplyModalPropsType } from "./index";

export default function useDetectPostCommentReply(props: {
  whenOpenSecondModal: () => void
} & ReplyModalPropsType) {
  const { visible: providerVis, closeModal, modalInfo: providerModalInfo} = props
  const [modalMainInfo, setModalMainInfo] = useState<{ visible: boolean; info?: ReplyModalInfoType }>({
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