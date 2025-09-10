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

const EditPost = () => {
  const { uri } = useParams<{ uri: string }>()

  const postUri = getPostUriHref(uri)

  const router = useRouter()
  const toast = useToast()

  const { userProfile } = useCurrentUser()

  const editorRef = useRef<EditorRefType>(null);
  const [publishing, setPublishing] = useState(false)
  const [textNumber, setTextNumber] = useState(0)
  const [publishDis, setPublishDis] = useState(false)
  const [richText, setRichText] = useState('')
  const [postTitle, setPostTitle] = useState('')


  const { data: postInfo } = useRequest(async () => {
    const result = await server<PostFeedItemType>('/post/detail', 'GET', {
      uri: postUri
    })
    setPostTitle(result?.title)
    setRichText(result?.text)
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

    const { content } = json
    if (!content) return
    const hasImageUploadErr = content.filter(e => e.type === "imageUpload")[0]
    if (hasImageUploadErr) {
      setPublishDis(true)
      return;
    }
    const hasUploadedImg = json.content?.find(e => e.type === 'image');

    setPublishDis(!text && !hasUploadedImg);
    setRichText(html)
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
          title: postTitle,
          text: richText,
          edited: dayjs.utc().format(),
          created: postInfo.created
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
        initialValue={postInfo?.title}
        className={S.input}
        wrapClassName={S.inputWrap}
        placeholder={'一句话标题（不少于6个字）'}
        showCount
        minLength={6}
        maxLength={100}
        onChange={setPostTitle}
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
                disabled={!postTitle.trim() || publishDis || !isAuthor}
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