import ManageModal, { FormItem } from "@/components/Modal/ManageModal";
import Input from "@/components/Input";
import TipTapEditor, { EditorRefType, EditorUpdateData } from "@/components/TipTapEditor";
import S from './index.module.scss'
import { useEffect, useRef, useState } from "react";
import { checkEditorContent } from "@/lib/tiptap-utils";
import { useBoolean } from "ahooks";
import { postsWritesPDSOperation, WritePDSOptParamsType } from "@/app/posts/utils";
import useCurrentUser from "@/hooks/useCurrentUser";
import dayjs from "dayjs";

const NoticeModal = (props: {
  noticeInfo?: any
  onClose: () => void
  refresh: () => void
  sectionId: string
}) => {
  const { noticeInfo, sectionId } = props;

  const { userProfile } = useCurrentUser()

  const [loading, setLoading] = useBoolean(false)

  const [titleStateDis, setTitleStateDis] = useState(true)
  const [richTextDis, setRichTextDis] = useState(true)

  const titleRef = useRef<string | undefined>(undefined)
  const richTextRef = useRef<string | undefined>(undefined)

  const editorRef = useRef<EditorRefType>(null);

  useEffect(() => {
    if(!noticeInfo) return
    setTimeout(() => {
      editorRef.current?.setContent(noticeInfo?.text)
    }, 0)
    titleRef.current = noticeInfo?.title;
    richTextRef.current = noticeInfo?.text;
    setTitleStateDis(false)
    setRichTextDis(false)
  }, [noticeInfo]);

  const onEditorChange = ({ json, text, html }: EditorUpdateData) => {
    const checkResult = checkEditorContent(json, text)
    setRichTextDis(!checkResult)
    richTextRef.current = html
  }

  const isEdit = !!noticeInfo?.uri

  const title = isEdit ? '编辑公告' : '发布新公告'

  const publish = async () => {
    setLoading.setTrue()

    const params: WritePDSOptParamsType = {
      record: {
        $type: 'app.bbs.post',
        section_id: sectionId!,
        title: titleRef.current || '',
        text: richTextRef.current || '',
        is_announcement: true
      },
      did: userProfile?.did!,
    }

    if (isEdit) {
      params.record.created = noticeInfo.created
      params.record.edited = dayjs.utc().format()
      params.type = 'update'
      params.rkey = noticeInfo.uri.split('/app.bbs.post/')[1]
    }

    await postsWritesPDSOperation(params)
    setLoading.setFalse()
    props.onClose()
    props.refresh()
  }

  return <ManageModal
    visible
    title={title}
    footer={{
      confirm: {
        disabled: titleStateDis || richTextDis || loading,
        onClick: publish
      },
      cancel: {
        onClick: props.onClose
      }
    }}
  >
    <div>
      <FormItem title={'公告标题'}>
        <Input
          inputValue={noticeInfo?.title}
          showCount
          minLength={6}
          maxLength={100}
          placeholder={'请输入标题'}
          onChange={v => titleRef.current = v}
          onCountCheck={passed => setTitleStateDis(!passed)}
        />
      </FormItem>
      <FormItem title={'公告内容'}>
        <div className={S.editor}>
          <TipTapEditor onUpdate={onEditorChange} ref={editorRef} />
        </div>
      </FormItem>
    </div>
  </ManageModal>
}

export default NoticeModal;