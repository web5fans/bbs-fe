import ManageModal, { FormItem } from "@/components/Modal/ManageModal";
import Input from "@/components/Input";
import TipTapEditor, { EditorUpdateData } from "@/components/TipTapEditor";
import S from './index.module.scss'
import { useEffect, useRef, useState } from "react";
import { checkEditorContent } from "@/lib/tiptap-utils";

const NoticeModal = (props: {
  noticeInfo?: any
  visible: boolean
  onClose: () => void
  refresh: () => void
}) => {
  const { noticeInfo, visible } = props;

  const [titleStateDis, setTitleStateDis] = useState(false)
  const [richTextDis, setRichTextDis] = useState(false)

  const titleRef = useRef<string | undefined>(undefined)
  const richTextRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    titleRef.current = noticeInfo?.title;
    setRichTextDis(!noticeInfo)
    setTitleStateDis(!noticeInfo)
  }, [noticeInfo]);

  const onEditorChange = ({ json, text, html }: EditorUpdateData) => {
    const checkResult = checkEditorContent(json, text)
    setRichTextDis(!checkResult)
    richTextRef.current = html
  }

  const title = noticeInfo?.uri ? '发布新公告' : '编辑公告'

  return <ManageModal
    visible={visible}
    title={title}
    footer={{
      confirm: {
        disabled: titleStateDis || richTextDis,
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
          <TipTapEditor onUpdate={onEditorChange} />
        </div>
      </FormItem>
    </div>
  </ManageModal>
}

export default NoticeModal;