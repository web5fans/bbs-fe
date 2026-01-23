'use client'

import S from './index.module.scss'
import { LayoutCenter } from "@/components/Layout";
import { useParams, useRouter } from "next/navigation";
import { getPostUriHref } from "@/lib/postUriHref";
import Input from "@/components/Input";
import TipTapEditor, { EditorRefType, EditorUpdateData } from "@/components/TipTapEditor";
import { useEffect, useRef, useState } from "react";
import { useRequest } from "ahooks";
import server from "@/server";
import numeral from "numeral";
import Button from "@/components/Button";
import CancelButton from "@/app/posts/edit/[uri]/_components/CancelButton";
import useCurrentUser from "@/hooks/useCurrentUser";
import { PostFeedItemType, postsWritesPDSOperation } from "@/app/posts/utils";
import dayjs from "dayjs";
import { useToast } from "@/provider/toast";
import { checkEditorContent } from "@/lib/tiptap-utils";

const EditPost = () => {
  const { uri } = useParams<{ uri: string }>()

  const postUri = getPostUriHref(uri)

  const router = useRouter()
  const toast = useToast()

  const { userProfile } = useCurrentUser()

  const editorRef = useRef<EditorRefType>(null);
  const [publishing, setPublishing] = useState(false)
  const [textNumber, setTextNumber] = useState(0)
  const [richTextDis, setRichTextDis] = useState(false)
  const [postTitleDis, setPostTitleDis] = useState(false)

  const richTextRef = useRef('')
  const postTitleRef = useRef('')


  const { data: postInfo } = useRequest(async () => {
    const result = await server<PostFeedItemType>('/post/detail', 'GET', {
      uri: postUri
    })
    postTitleRef.current = result.title
    richTextRef.current = result?.text
    return result
  }, {
    ready: !!postUri,
    refreshDeps: [postUri]
  })

  useEffect(() => {
    if(!postInfo || !editorRef.current) return
    editorRef.current.setContent(postInfo.text)

    const div = document.createElement("div");
    div.innerHTML = postInfo.text;
    setTextNumber(div.innerText.length)
  }, [postInfo]);

  const editorUpdate = ({ json, text, html }: EditorUpdateData) => {
    const textNumber = text.length

    setTextNumber(textNumber)

    const checkResult = checkEditorContent(json, text)
    setRichTextDis(!checkResult)
    richTextRef.current = html
  }

  const submitEdit = async () => {
    if (!postInfo) return
    setPublishing(true)
    const posturi = postInfo.uri;
    const rkey = posturi.split('/app.bbs.post/')[1]

    try {
      const uri = await postsWritesPDSOperation({
        record: {
          $type: 'app.bbs.post',
          section_id: postInfo.section_id,
          title: postTitleRef.current,
          text: richTextRef.current,
          edited: dayjs.utc().format(),
          created: postInfo.created,
          is_announcement: postInfo.is_announcement,
          is_top: postInfo.is_top,
          is_disabled: postInfo.is_disabled,
        },
        did: userProfile?.did!,
        rkey,
        type: 'update'
      })
      toast({ title: '发布成功', icon: 'success'})
      setPublishing(false)
      router.back()
    } catch (error) {
      toast({ title: '发布失败', icon: 'error'})
      setPublishing(false)
    }
  }

  const isAuthor = postInfo?.author.did === userProfile?.did

  return <LayoutCenter>
    <div className={S.wrap}>
      <p className={S.title}>编辑帖子</p>
      <Input
        inputValue={postInfo?.title}
        className={S.input}
        wrapClassName={S.inputWrap}
        placeholder={'一句话标题（不少于6个字）'}
        showCount={true}
        minLength={6}
        maxLength={100}
        onChange={v => postTitleRef.current = v}
        onCountCheck={pass => setPostTitleDis(!pass)}
      />
      <div className={S.editor}>
        <TipTapEditor ref={editorRef} onUpdate={editorUpdate} />
      </div>
      <div className={S.footer}>
        <p className={S.count}>字数：{numeral(textNumber).format('0,0')}</p>

        <div className={S.options}>
          {
            publishing ? <Button
                className={S.publish}
                disabled
              >发布中...</Button>
              : <Button
                type="primary"
                className={S.publish}
                disabled={postTitleDis || richTextDis || !isAuthor}
                onClick={submitEdit}
              >发布</Button>
          }
          <CancelButton className={S.cancel} disabled={!isAuthor || publishing} />
        </div>
      </div>
    </div>
  </LayoutCenter>
}

export default EditPost;