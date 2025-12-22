'use client'

import S from './index.module.scss'
import { useEffect, useMemo, useRef, useState } from "react";
import CardWindow from "@/components/CardWindow";
import TipTapEditor, { EditorRefType, EditorUpdateData } from "@/components/TipTapEditor";
import Button from "@/components/Button";
import { checkEditorContent } from "@/lib/tiptap-utils";
import numeral from "numeral";
import { postsWritesPDSOperation } from "@/app/posts/utils";
import useCurrentUser from "@/hooks/useCurrentUser";
import PackUpIcon from '@/assets/posts/pack-up.svg'
import { useBoolean } from "ahooks";
import cx from "classnames";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { useToast } from "@/provider/toast";
import useDetectPostCommentReply from "./useDetectPostCommentReply";
import dayjs from "dayjs";

const ReplyModal = () => {
  const { updateProfile, userProfile } = useCurrentUser();
  const [publishing, setPublishing] = useState(false)

  const [textNumber, setTextNumber] = useState(0)
  const [publishDis, setPublishDis] = useState(true)

  const [packUp, { toggle: togglePackUp, setFalse: setPackUpFalse }] = useBoolean(false)
  const [confirmModalVis, { setTrue: setConfirmTrue, setFalse: setConfirmFalse }] = useBoolean(false)

  const { visible, modalInfo, closeModal, clearCloseTask } = useDetectPostCommentReply({
    whenOpenSecondModal: () => {
      closeWindow(true)
    }
  })

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
    const { type, postUri, commentUri, toDid, sectionId, refresh, isEdit } = modalInfo;
    const message = isEdit ? '编辑' : '发布'

    setPublishing(true)
    await updateProfile()
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
      if (isEdit) {
        record = {...record, created: modalInfo.content.created, edited: dayjs.utc().format()}
      }
      await postsWritesPDSOperation({
        record,
        did: userProfile?.did!,
        type: isEdit ? 'update' : 'create',
        rkey: isEdit ? modalInfo.content.uri.split(`/${record.$type}/`)[1] : undefined
      })
      refresh?.();
      setPublishing(false)
      closeWindow(false)
      toast({ title: message + '成功', icon: 'success' })
    } catch (error) {
      setPublishing(false)
      toast({ title: message + '失败', icon: 'error' })
    }
  }

  const fillEditorContent = (richText: string) => {
    const div = document.createElement("div")
    div.innerHTML = richText;
    setTextNumber(div.innerText.length);
    setPublishDis(false)

    richTextRef.current = richText;

    setTimeout(() => {
      editorRef.current?.setContent(richText)
    }, 0)
  }

  useEffect(() => {
    if (!visible || !modalInfo) return
    const { type, quoteContent, isEdit } = modalInfo

    if (isEdit) {
      fillEditorContent(modalInfo.content.text)
      return;
    }

    if (type === 'quote' && editorRef.current) {
      const content = `<blockquote><p>${quoteContent}</p></blockquote>${richTextRef.current}`;
      fillEditorContent(content)
    }
  }, [visible, modalInfo]);

  const title = useMemo(() => {
    if (!modalInfo) return "";
    const { type, toUserName, isEdit } = modalInfo;

    const titlePrefix = isEdit ? '编辑 ' : ''

    let title: string;

    switch (type) {
      case "quote":
        title = "回复帖子";
        break
      case "reply":
        title = `回复 ${toUserName}`;
        break
      case "comment":
        title =  "跟帖讨论";
        break
    }

    return titlePrefix + title
  }, [modalInfo])

  if (!visible) return null

  return <>
    <div className={cx(S.wrap, packUp && S.wrapPack)} style={modalInfo?.rect}>
      <CardWindow
        headerClick={togglePackUp}
        header={title}
        wrapClassName={S.window}
        headerClassName={S.windowHeader}
        showCloseButton
        noInnerWrap
        onClose={(e) => {
          e.stopPropagation()
          closeWindow()
        }}
        headerExtra={<div
          className={S.packup}
          onClick={e => {
            e.stopPropagation()
            togglePackUp()
          }}
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
              {publishing ? <Button
                type={'primary'}
                className={S.button}
                disabled
              >发布中...</Button> : <Button
                type={'primary'}
                className={S.button}
                disabled={publishDis}
                onClick={submit}
              >发布</Button>}
              <Button className={S.button} disabled={publishing} onClick={() => closeWindow()}>取消</Button>
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
          onClick: () => {
            setConfirmFalse()
            clearCloseTask()
          },
        }
      }}
    />
  </>
}

export default ReplyModal;