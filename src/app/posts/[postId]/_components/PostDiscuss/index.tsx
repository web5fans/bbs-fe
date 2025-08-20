'use client'

import S from './index.module.scss'
import TipTapEditor, { EditorRefType, EditorUpdateData } from "@/components/TipTapEditor";
import Button from "@/components/Button";
import FaceIcon from '@/assets/login/multiDid/face.svg'
import { useRegisterPopUp } from "@/provider/RegisterPopUpProvider";
import PublishPostCancelButton from "@/components/PublishPostCancelButton";
import { useRef, useState } from "react";
import { writesPDSOperation } from "@/app/posts/utils";
import { useToast } from "@/provider/toast";
import useUserInfoStore from "@/store/userInfo";

const PostDiscuss = (props: {
  postUri: string
  sectionId: string
  refresh?: () => void
}) => {
  const { userInfo } = useUserInfoStore()
  const [publishing, setPublishing] = useState(false)

  const [richText, setRichText] = useState('')

  const editorRef = useRef<EditorRefType>(null)

  const toast = useToast()

  const editorUpdate = ({ json, html }: EditorUpdateData) => {
    const { content } = json
    if (!content) return
    const hasImageUploadErr = content.filter(e => e.type === "imageUpload")[0]
    if (hasImageUploadErr) return;
    setRichText(html)
  }

  const publishReply = async () => {
    setPublishing(true)
    try {
      await writesPDSOperation({
        record: {
          $type: 'app.bbs.reply',
          text: richText,
          root: props.postUri,
          parent: props.postUri,
          section_id: props.sectionId,
        },
        did: userInfo?.did!
      })
      setPublishing(false)
      editorRef.current?.clearContent()
      props.refresh?.()
      toast({ title: '发布成功', icon: 'success'})
    } catch (error) {
      setPublishing(false)
      toast({ title: '发布失败', icon: 'error'})
    }
  }

  if (!userInfo) {
    return <div className={S.wrap}>
      <p className={S.title}>跟帖讨论</p>
      <NoAuth />
    </div>
  }

  return <div className={S.wrap} id={'comment_post'}>
    <p className={S.title}>跟帖讨论</p>
    <div className={S.editor}>
      <TipTapEditor onUpdate={editorUpdate} ref={editorRef} />
    </div>
    <div className={S.footer}>
      {
        publishing ? <Button
            type={'primary'}
            className={S.publish}
            disabled
          >发布中...</Button>
          : <Button
            type={'primary'}
            className={S.publish}
            disabled={!richText}
            onClick={publishReply}
          >发布</Button>
      }
      <PublishPostCancelButton className={S.publish} />
    </div>
  </div>
}

export default PostDiscuss;

function NoAuth() {
  const { openRegisterPop } = useRegisterPopUp()

  return <div className={S.empty}>
    <FaceIcon />
    <p className={S.tips}>抱歉！仅限已注册BBS论坛账号的用户跟帖讨论</p>
    <Button
      type={'primary'}
      className={S.log}
      onClick={openRegisterPop}
    >立刻注册</Button>
    {/*<p*/}
    {/*  className={S.mes}*/}
    {/*  onClick={openRegisterPop}*/}
    {/*>没有账号？立刻创建*/}
    {/*</p>*/}
  </div>
}