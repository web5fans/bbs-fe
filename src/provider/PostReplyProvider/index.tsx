'use client'

import React, { createContext, useCallback, useState } from "react";

export type ModalInfoType = {
  postUri: string // 主帖
  commentUri?: string // 跟帖
  toDid?: string // 对方did, 回复楼层内的评论时传
  toUserName?: string // 回复用户的名称
  sectionId: string
  refresh?: () => void
} & ({
  type: 'quote'
  quoteContent: string
} | {
  type: 'reply' | 'comment'
})

type PopUpProviderProps = {
  visible: boolean
  openModal: (info?: ModalInfoType) => void
  closeModal: () => void
  modalInfo?: ModalInfoType
}

const PostCommentReplyContext = createContext<PopUpProviderProps>({
  visible: false,
  openModal: () => {},
  closeModal: () => {},
})

export const PostCommentReplyProvider = (props: {
  children: React.ReactNode
}) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [modalInfo, setModalInfo] = useState<ModalInfoType>()

  const openModal = useCallback((info) => {
    if (info) {
      setModalInfo(info)
    }
    setVisible(true)
  }, [])

  const closeModal = () => {
    setModalInfo(undefined)
    setVisible(false)
  }

  return <PostCommentReplyContext.Provider value={{
    visible,
    closeModal,
    openModal,
    modalInfo,
  }}>
    {props.children}
  </PostCommentReplyContext.Provider>
}

export function usePostCommentReply() {
  const context = React.useContext(PostCommentReplyContext);

  return context;
}