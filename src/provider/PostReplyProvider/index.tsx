'use client'

import React, { createContext, CSSProperties, useCallback, useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { CommentOrReplyItemType } from "@/app/posts/utils";
import { UserProfileType } from "@/store/userInfo";

export type ReplyModalInfoType = {
  postUri: string // 主帖
  commentUri?: string // 跟帖
  toDid?: string // 对方did, 回复楼层内的评论时传
  // toUserName?: string // 回复用户的名称
  toAuthor?: UserProfileType // 回复用户的信息
  sectionId: string
  refresh?: (info: CommentOrReplyItemType, isEdit?: boolean) => void
  rect?: CSSProperties
} & ({
  type: 'quote'
  quoteContent: string
} | {
  type: 'reply' | 'comment'
}) & ({
  isEdit: true
  content: {
    uri: string;
    text: string;
    created: string
  }
} | {
  isEdit?: false
})

type PopUpProviderProps = {
  visible: boolean
  openModal: (info?: ReplyModalInfoType) => void
  closeModal: () => void
  modalInfo?: ReplyModalInfoType
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
  const [modalInfo, setModalInfo] = useState<ReplyModalInfoType>()
  const { isWhiteUser } = useCurrentUser()

  const openModal = useCallback((info?: ReplyModalInfoType) => {
    if (!isWhiteUser) return
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