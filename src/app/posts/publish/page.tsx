'use client'

import S from './index.module.scss'
import StyledSelect from "./(components)/Select";
import Input from "@/components/Input";
import TipTapEditor, { EditorUpdateData } from "@/components/TipTapEditor";
import Button from "@/components/Button";
import numeral from 'numeral'
import { useState } from "react";
import useUserInfoStore from "@/store/userInfo";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PublishPostCancelButton from "@/components/PublishPostCancelButton";
import ReadIcon from '@/assets/posts/read.svg'
import ReplyIcon from '@/assets/posts/reply.svg'
import MoneyIcon from '@/assets/posts/money.svg'
import SectionEarth from '@/assets/posts/section.svg'
import { useRequest } from "ahooks";
import { getSectionList, publishNewPostAndReply } from "@/app/posts/utils";
import cx from "classnames";
import { useToast } from "../../../provider/toast";
import dayjs from "dayjs";

const PublishPostPage = () => {
  const searchParams = useSearchParams()

  const defaultSection = searchParams.get('section') || ''

  const { userInfo } = useUserInfoStore()
  const [textNumber, setTextNumber] = useState(0)
  const [postTitle, setPostTitle] = useState('')
  const [richText, setRichText] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [sectionId, setSectionId] = useState(defaultSection)



  const toast = useToast()

  const router = useRouter()

  const { data: sectionList } = useRequest(async () => {
    const result = await getSectionList()
    const options = result.map(i => ({
      ...i,
      value: i.id.toString(),
      label: i.name,
    }))
    if (!sectionId) {
      setSectionId(options[0].id)
    }

    return options
  })

  // if (!userInfo) {
  //   router.replace('/')
  // }

  const editorUpdate = ({ json, text, html }: EditorUpdateData) => {
    const textNumber = text.length

    setTextNumber(textNumber)

    console.log('json', json)
    const { content } = json
    if (!content) return
    const hasImageUploadErr = content.filter(e => e.type === "imageUpload")[0]
    if (hasImageUploadErr || !textNumber) return;
    setRichText(html)
  }

  const publishPost = async () => {
    setPublishing(true)
    try {
      const uri = await publishNewPostAndReply({
        record: {
          $type: 'app.bbs.post',
          section_id: sectionId!,
          title: postTitle,
          text: richText,
          created: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
        did: userInfo?.did!
      })
      setPublishing(false)

      const encodeUri = encodeURIComponent(uri)
      let href = '/posts/'+ encodeUri
      if (defaultSection) {
        href = `/section/${defaultSection}` + encodeUri
      }

      router.replace(href)

      toast({ title: '发布成功', icon: 'success'})
    } catch (error) {
      setPublishing(false)
      toast({ title: '发布失败', icon: 'error'})
    }
  }

  const allowPublish = !!richText && !!postTitle

  const noAuth = !userInfo

  return <div className={S.container}>
    <div className={S.wrap}>
      <p className={S.title}>发布新帖子</p>

      <div className={S.header}>
        <StyledSelect
          options={sectionList || []}
          selectedValue={sectionId}
          onChange={setSectionId}
          renderItem={(item) => {
            return <SelectDropItem itemInfo={item} isChosen={item.id === sectionId} />
          }}
        />
        <Input
          className={S.input}
          wrapClassName={S.inputWrap}
          placeholder={'一句话总结你想讨论的问题/话题/内容作为标题（不少于6个字）'}
          showCount
          minLength={6}
          maxLength={100}
          onChange={setPostTitle}
        />
      </div>

      <div className={S.editor}>
        <TipTapEditor onUpdate={editorUpdate} disabled={noAuth} />
      </div>
      <div className={S.footer}>
        <p className={S.count}>字数：{numeral(textNumber).format('0,0')}</p>

        <div className={S.options}>
          {
            publishing ? <Button className={S.publish} disabled>发布中...</Button>
              : <Button
                type="primary"
                className={S.publish}
                disabled={!allowPublish || noAuth}
                onClick={publishPost}
              >发布</Button>
          }
          <PublishPostCancelButton disabled={noAuth} />
        </div>
      </div>
    </div>
  </div>
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
          0
        </p>
        <p className={S.infoItem}>
          <ReplyIcon />
          0
        </p>
        {/*<p className={S.infoItem}>*/}
        {/*  <MoneyIcon />*/}
        {/*  666*/}
        {/*</p>*/}
      </div>
    </div>
  </div>
}