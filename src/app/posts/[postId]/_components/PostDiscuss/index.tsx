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
import useCurrentUser from "@/hooks/useCurrentUser";
import Link from "next/link";
import { APPLY_WHITE_LIST_URL } from "@/constant/constant";

const PostDiscuss = (props: {
  postUri: string
  sectionId: string
  refresh?: () => void
}) => {
  const { userProfile, hasLoggedIn, isWhiteUser, updateProfile } = useCurrentUser()
  const [publishing, setPublishing] = useState(false)

  const [richText, setRichText] = useState('')
  const [publishDis, setPublishDis] = useState(false)

  const editorRef = useRef<EditorRefType>(null)

  const toast = useToast()

  const editorUpdate = ({ json, html, text }: EditorUpdateData) => {
    const { content } = json
    if (!content) return
    const hasImageUploadErr = content.filter(e => e.type === "imageUpload")[0]
    if (hasImageUploadErr) {
      setPublishDis(true);
      return;
    }

    const hasUploadedImg = json.content?.find(e => e.type === 'image');

    setPublishDis(!text && !hasUploadedImg);

    setRichText(html)
  }

  const publishComment = async () => {
    setPublishing(true)
    try {
      await updateProfile()
      await writesPDSOperation({
        record: {
          $type: 'app.bbs.comment',
          text: richText,
          post: props.postUri,
          section_id: props.sectionId,
        },
        did: userProfile?.did!
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

  if (!hasLoggedIn) {
    return <div className={S.wrap}>
      <p className={S.title}>跟帖讨论</p>
      <NoAuth />
    </div>
  }

  if (!isWhiteUser) {
    return <div className={S.wrap}>
      <p className={S.title}>跟帖讨论</p>
      <NoWhiteAuth />
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
            disabled={publishDis || !richText}
            onClick={publishComment}
          >发布</Button>
      }
      <PublishPostCancelButton className={S.publish} disabled={publishDis || !richText} />
    </div>
  </div>
}

export default PostDiscuss;

function NoAuth() {
  const { openRegisterPop } = useRegisterPopUp()

  return <div className={S.empty}>
    <FaceIcon className={S.faceIcon} />
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

function NoWhiteAuth() {
  return <div className={S.empty}>
    <FaceIcon className={S.faceIcon} />
    <p className={S.tips}>抱歉！仅限白名单用户跟帖讨论</p>
    <Link href={APPLY_WHITE_LIST_URL} target={'_blank'}>
      <Button
        type={'primary'}
        className={S.white}
      >申请开通白名单</Button>
    </Link>
  </div>
}