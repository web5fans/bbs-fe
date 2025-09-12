'use client'

import S from './index.module.scss'
import { useEffect, useMemo, useRef, useState } from "react";
import CardWindow from "@/components/CardWindow";
import TipTapEditor, { EditorRefType, EditorUpdateData } from "@/components/TipTapEditor";
import Button from "@/components/Button";
import { usePostCommentReply } from "@/provider/PostReplyProvider";
import { checkEditorContent } from "@/lib/tiptap-utils";
import numeral from "numeral";
import { useRouter } from "next/navigation";
import { postsWritesPDSOperation } from "@/app/posts/utils";
import useCurrentUser from "@/hooks/useCurrentUser";
import PackUpIcon from '@/assets/posts/pack-up.svg'
import { useBoolean } from "ahooks";
import cx from "classnames";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { useToast } from "@/provider/toast";

const ReplyModal = () => {
  const { updateProfile, userProfile } = useCurrentUser();
  const { visible, closeModal, modalInfo} = usePostCommentReply()
  const [publishing, setPublishing] = useState(false)

  const [textNumber, setTextNumber] = useState(0)
  const [publishDis, setPublishDis] = useState(true)

  const [packUp, { toggle: togglePackUp, setFalse: setPackUpFalse }] = useBoolean(false)
  const [confirmModalVis, { setTrue: setConfirmTrue, setFalse: setConfirmFalse }] = useBoolean(false)

  const editorRef = useRef<EditorRefType>(null)
  const richTextRef = useRef('')

  const toast = useToast()

  const editorUpdate = ({ json, html, text }: EditorUpdateData) => {
    setTextNumber(text.length);
    const checkResult = checkEditorContent(json, text)
    setPublishDis(!checkResult)

    richTextRef.current = html
  }

  const closeWindow = (needTwiceCheck: boolean = true) => {
    if (richTextRef.current && needTwiceCheck && !publishDis) {
      setConfirmTrue()
      return
    }
    setPackUpFalse()
    setConfirmFalse()
    setPublishing(false)
    richTextRef.current = ''
    setPublishDis(true)
    setTextNumber(0)
    closeModal()
  }

  const submit = async () => {
    if (!modalInfo) return
    const { type, postUri, commentUri, toDid, sectionId, refresh } = modalInfo;
    setPublishing(true)
    // await updateProfile()
    try {
      let record;
      if (['comment', 'quote'].includes(type)) {
        record = {
          $type: 'app.bbs.comment',
          text: richTextRef.current,
          post: postUri,
          section_id: sectionId,
        }
      } else {
        record = {
          $type: 'app.bbs.reply',
          text: richTextRef.current,
          post: postUri,
          section_id: sectionId,
          comment: commentUri,
          to: toDid
        }
      }
      await postsWritesPDSOperation({
        record,
        did: userProfile?.did!
      })
      refresh?.();
      setPublishing(false)
      closeWindow(false)
      toast({ title: '发布成功', icon: 'success' })
    } catch (error) {
      setPublishing(false)
      toast({ title: '发布失败', icon: 'error' })
    }
  }

  useEffect(() => {
    if (!visible || !modalInfo) return
    const { type, quoteContent } = modalInfo
    if (type === 'quote' && editorRef.current) {

      const content = `<blockquote><p>${quoteContent}</p></blockquote>${richTextRef.current}`;

      const div = document.createElement("div")
      div.innerHTML = content;
      setTextNumber(div.innerText.length);
      setPublishDis(false)

      richTextRef.current = content;

      setTimeout(() => {
        editorRef.current.setContent(content)
      }, 0)

    }
  }, [visible, modalInfo]);

  const title = useMemo(() => {
    if (!modalInfo) return "";
    const { type, toUserName } = modalInfo;
    switch (type) {
      case "quote":
        return "回复帖子"
      case "reply":
        return `回复 ${toUserName}`
      case "comment":
        return "跟帖讨论"
    }
  }, [modalInfo])

  if (!visible) return null

  return <>
    <div className={cx(S.wrap, packUp && S.wrapPack)}>
      <CardWindow
        header={title}
        wrapClassName={S.window}
        headerClassName={S.windowHeader}
        showCloseButton
        noInnerWrap
        onClose={() => closeWindow()}
        headerExtra={<div
          className={S.packup}
          onClick={togglePackUp}
        ><PackUpIcon className={S.packIcon} /></div>}
      >
        <div className={S.content}>
          <div className={S.editor}>
            <TipTapEditor
              onUpdate={editorUpdate}
              ref={editorRef}
            />
          </div>
          <div className={S.footer}>
            <p className={S.textNum}>字数：{numeral(textNumber).format('0,0')}</p>
            <div className={S.butonWrap}>
              <Button
                type={'primary'}
                className={S.button}
                disabled={publishDis}
                onClick={submit}
              >发布</Button>
              <Button className={S.button} onClick={() => closeWindow()}>取消</Button>
            </div>
          </div>
        </div>
      </CardWindow>
    </div>
    <ConfirmModal
      lockScroll={false}
      visible={confirmModalVis}
      message={'确定关闭？关闭后，内容将不保留。有重要内容，请先备份哦！'}
      footer={{
        confirm: {
          text: '确认关闭',
          onClick: () => closeWindow(false)
        },
        cancel: {
          text: '再想想',
          onClick: setConfirmFalse,
        }
      }}
    />
  </>
}

export default ReplyModal;