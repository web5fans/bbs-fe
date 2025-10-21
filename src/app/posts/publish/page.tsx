'use client'

import S from './index.module.scss'
import StyledSelect from "./(components)/Select";
import Input from "@/components/Input";
import TipTapEditor, { EditorUpdateData } from "@/components/TipTapEditor";
import Button from "@/components/Button";
import numeral from 'numeral'
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PublishPostCancelButton from "@/components/PublishPostCancelButton";
import ReadIcon from '@/assets/posts/read.svg'
import CommentIcon from '@/assets/posts/comment.svg'
import MoneyIcon from '@/assets/posts/money.svg'
import SectionEarth from '@/assets/posts/section.svg'
import { useRequest } from "ahooks";
import { getSectionList, postsWritesPDSOperation } from "@/app/posts/utils";
import cx from "classnames";
import { useToast } from "../../../provider/toast";
import useCurrentUser from "@/hooks/useCurrentUser";
import { postUriToHref } from "@/lib/postUriHref";
import { LayoutCenter } from "@/components/Layout";
import { checkEditorContent } from "@/lib/tiptap-utils";

const PublishPostPage = () => {
  const searchParams = useSearchParams()

  const defaultSection = searchParams.get('section') || ''

  const { isWhiteUser, userProfile, updateProfile } = useCurrentUser()
  const [textNumber, setTextNumber] = useState(0)
  const [postTitle, setPostTitle] = useState('')
  const [richText, setRichText] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [sectionId, setSectionId] = useState(defaultSection)
  const [publishDis, setPublishDis] = useState(false)


  const toast = useToast()

  const router = useRouter()

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

    setTextNumber(textNumber)

    const { content } = json
    if (!content) return
    const checkResult = checkEditorContent(json, text)
    setPublishDis(!checkResult)
    setRichText(html)
  }

  const publishPost = async () => {
    setPublishing(true)
    try {
      await updateProfile()
      const uri = await postsWritesPDSOperation({
        record: {
          $type: 'app.bbs.post',
          section_id: sectionId!,
          title: postTitle,
          text: richText,
        },
        did: userProfile?.did!
      })
      setPublishing(false)

      const encodeUri = postUriToHref(uri)
      let href = '/posts/'+ encodeUri
      if (defaultSection) {
        href = `/section/${sectionId}/` + encodeUri
      }

      router.replace(href)

      toast({ title: '发布成功', icon: 'success'})
    } catch (error) {
      setPublishing(false)
      toast({ title: '发布失败', icon: 'error'})
    }
  }

  const allowPublish = !(!richText || publishDis) && !!postTitle.trim()

  const noAuth = !isWhiteUser

  return <LayoutCenter>
    <div className={S.wrap}>
      <p className={S.title}>发布新帖子</p>

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
          className={S.input}
          wrapClassName={S.inputWrap}
          placeholder={'一句话标题（不少于6个字）'}
          showCount
          minLength={6}
          maxLength={100}
          onChange={setPostTitle}
        />
      </div>

      <div className={S.editor}>
        <TipTapEditor
          onUpdate={editorUpdate}
          editable={!noAuth}
        />
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
                disabled={!allowPublish || noAuth}
                onClick={publishPost}
              >发布</Button>
          }
          <PublishPostCancelButton disabled={!allowPublish || noAuth} className={S.cancel} />
        </div>
      </div>
    </div>
  </LayoutCenter>
}

export default PublishPostPage;


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
        {/*<p className={S.infoItem}>*/}
        {/*  <MoneyIcon />*/}
        {/*  666*/}
        {/*</p>*/}
      </div>
    </div>
  </div>
}