'use client'

import S from './index.module.scss'
import StyledSelect from "./(components)/Select";
import Input, { InputRefType } from "@/components/Input";
import TipTapEditor, { EditorRefType, EditorUpdateData } from "@/components/TipTapEditor";
import Button from "@/components/Button";
import numeral from 'numeral'
import { useImperativeHandle, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReadIcon from '@/assets/posts/read.svg'
import CommentIcon from '@/assets/posts/comment.svg'
import SectionEarth from '@/assets/posts/section.svg'
import { useRequest } from "ahooks";
import { getSectionList, postsWritesPDSOperation } from "@/app/posts/utils";
import cx from "classnames";
import { useToast } from "../../../provider/toast";
import useCurrentUser from "@/hooks/useCurrentUser";
import { postUriToHref } from "@/lib/postUriHref";
import { LayoutCenter } from "@/components/Layout";
import { checkEditorContent } from "@/lib/tiptap-utils";
import useAutoSaveDraft from "@/hooks/useAutoSaveDraft";
import DraftInfo from "@/app/posts/publish/(components)/DraftInfo";
import CancelButton from "@/app/posts/publish/(components)/CancelButton";
import DraftSearchParamsWrap, {
  SetPostContentParamsType
} from "@/app/posts/publish/(components)/DraftSearchParamsWrap";

const PublishPostPage = () => {
  const searchParams = useSearchParams()

  const defaultSection = searchParams.get('section') || ''

  const { isWhiteUser, userProfile, updateProfile } = useCurrentUser()

  const [publishing, setPublishing] = useState(false)
  const [sectionId, setSectionId] = useState(defaultSection)

  const [richTextDis, setRichTextDis] = useState(true)
  const [postTitleDis, setPostTitleDis] = useState(true)

  const postTitleRef = useRef('')
  const richTextRef = useRef('')

  const toast = useToast()

  const router = useRouter()

  const editorRef = useRef<EditorRefType>(null);
  const inputRef = useRef<InputRefType>(null);
  const textNumberRef = useRef<RichTextNumberRefType>(null);

  const { autoSaveDraft,
    deleteDraft,
    manualSaveDraft,
    loading: autoSaveLoading,
    updatedTime: autoSavedTime,
    setDraftInfo,
    draftUri,
  } = useAutoSaveDraft()

  const { data: sectionList } = useRequest(async () => {
    const result = await getSectionList(userProfile?.did)
    const options = result.map(i => ({
      ...i,
      value: i.id.toString(),
      label: i.name,
    }))
    if (!sectionId) {
      setSectionId(options[0].id)
    }

    return options
  }, {
    refreshDeps: [userProfile?.did],
  })

  const editorUpdate = ({ json, text, html }: EditorUpdateData) => {
    const textNumber = text.length

    const filteredHtml = html.replace(/<div[^>]*data-type="image-upload"[^>]*><\/div>/g, '')

    textNumberRef.current?.setNumber(textNumber)
    autoSaveDraft({
      sectionId,
      title: postTitleRef.current,
      text: filteredHtml,
    })

    const { content } = json
    if (!content) return
    const checkResult = checkEditorContent(json, text)
    setRichTextDis(!checkResult)
    richTextRef.current = filteredHtml
  }

  const publishPost = async () => {
    setPublishing(true)
    try {
      await updateProfile()
      const { uri } = await postsWritesPDSOperation({
        record: {
          $type: 'app.bbs.post',
          section_id: sectionId!,
          title: postTitleRef.current,
          text: richTextRef.current,
        },
        did: userProfile?.did!
      })

      deleteDraft({
        title: postTitleRef.current,
        text: richTextRef.current,
        sectionId
      })
      setPublishing(false)

      if (uri) {
        const encodeUri = postUriToHref(uri)
        let href = '/posts/'+ encodeUri
        if (defaultSection) {
          href = `/section/${sectionId}/` + encodeUri
        }

        router.replace(href)
      }

      toast({ title: '发布成功', icon: 'success'})
    } catch (error) {
      setPublishing(false)
      toast({ title: '发布失败', icon: 'error'})
    }
  }

  // 草稿填充页面
  const draftToPostContent = (v: SetPostContentParamsType) => {
    const { title, text } = v;
    postTitleRef.current = title
    richTextRef.current = text
    editorRef.current?.setContent(text)
    setSectionId(v.sectionId)
    inputRef.current?.setInputValue(title)
    setRichTextDis(false)

    textNumberRef.current?.setHtmlNumber(text)
    setDraftInfo(v)
  }

  const allowPublish = !richTextDis && !postTitleDis

  const noAuth = !isWhiteUser

  return <LayoutCenter>
    <DraftSearchParamsWrap setPostContent={draftToPostContent}>
      <div className={S.wrap}>
        <div className={S.title}>
          <span>发布新帖子</span>

          <DraftInfo
            loading={autoSaveLoading}
            updatedTime={autoSavedTime}
            setPostContent={draftToPostContent}
            curDraftUri={draftUri}
          />
        </div>

        <div className={S.header}>
          <StyledSelect
            className={S.select}
            options={sectionList || []}
            selectedValue={sectionId}
            onChange={setSectionId}
            renderItem={(item) => {
              return <SelectDropItem
                itemInfo={item}
                isChosen={item.id === sectionId}
              />
            }}
          />
          <Input
            ref={inputRef}
            className={S.input}
            wrapClassName={S.inputWrap}
            placeholder={'一句话标题（不少于6个字）'}
            showCount
            minLength={6}
            maxLength={100}
            onChange={v => {
              postTitleRef.current = v;
              autoSaveDraft({
                sectionId,
                title: v,
                text: richTextRef.current,
              })
            }}
            onCountCheck={passed => setPostTitleDis(!passed)}
          />
        </div>

        <div className={S.editor}>
          <TipTapEditor
            onUpdate={editorUpdate}
            editable={!noAuth}
            ref={editorRef}
          />
        </div>
        <div className={S.footer}>
          <RichTextNumber ref={textNumberRef} />

          <div className={S.options}>
            {
              publishing ? <Button
                  className={S.publish}
                  disabled
                >发布中...</Button>
                : <Button
                  type="primary"
                  className={S.publish}
                  disabled={!allowPublish || noAuth}
                  onClick={publishPost}
                >发布</Button>
            }
            <CancelButton
              disabled={!allowPublish || noAuth}
              className={S.cancel}
              deleteDraft={() => {
                deleteDraft({
                  title: postTitleRef.current,
                  text: richTextRef.current,
                  sectionId
                })
              }}
              saveDraft={() => {
                manualSaveDraft({
                  title: postTitleRef.current,
                  text: richTextRef.current,
                  sectionId
                })
              }}
            />
          </div>
        </div>
      </div>
    </DraftSearchParamsWrap>
  </LayoutCenter>
}

export default PublishPostPage;

type RichTextNumberRefType = {
  setNumber: (num: number) => void
  setHtmlNumber: (html: string) => void
}

function RichTextNumber(props: {
  ref?: React.Ref<RichTextNumberRefType>
}) {
  const [textNumber, setTextNumber] = useState(0)

  useImperativeHandle(props.ref, () => {
    return {
      setHtmlNumber: (html: string) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        setTextNumber(div.innerText.length)
      },
      setNumber: setTextNumber
    }
  })

  return <p className={S.count}>字数：{numeral(textNumber).format('0,0')}</p>
}


function SelectDropItem(props: {
  itemInfo: any,
  isChosen?: boolean
}) {
  const { itemInfo } = props;

  return <div className={cx(S.popoverItem, props.isChosen && S.selected)}>
    <div className={S.image}>
      <SectionEarth />
    </div>
    <div className={S.content}>
      <p className={S.contentT}>{itemInfo.name}</p>
      <div className={S.info}>
        <p className={S.infoItem}>
          <ReadIcon />
          {itemInfo.post_count}
        </p>
        <p className={S.infoItem}>
          <CommentIcon />
          {itemInfo.comment_count}
        </p>
      </div>
    </div>
  </div>
}