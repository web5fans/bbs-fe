import ManageModal from "@/components/Modal/ManageModal";
import S from './index.module.scss'
import Input from "@/components/Input";
import UploadAvatar from "./UploadAvatar";
import TextArea from "@/components/TextArea";
import { SectionItem } from "@/app/posts/utils";
import { useEffect, useState } from "react";

const EditInfoModal = (props: {
  visible: boolean,
  onClose: () => void
  sectionInfo?: SectionItem
  refreshDetail: () => void
}) => {
  const { visible, onClose, sectionInfo, refreshDetail } = props;
  const [ secInfo, setSecInfo ] = useState({} as SectionItem);

  useEffect(() => {
    if (!sectionInfo) return
    setSecInfo(sectionInfo);
  }, [sectionInfo]);

  const changeSecInfo = (info: Partial<SectionItem>) => {
    setSecInfo({...secInfo, ...info});
  }

  const cancel = () => {
    setSecInfo(sectionInfo || {} as SectionItem);
    onClose()
  }

  const onConfirm = async () => {
    refreshDetail()
    cancel()
  }

  return <ManageModal
    visible={visible}
    title={'编辑版区信息'}
    footer={{
      confirm: {
        disabled: !secInfo.name || !secInfo.description,
        onClick: onConfirm
      },
      cancel: {
        onClick: cancel,
      }
    }}
  >
    <div className={S.container}>
      <div className={S.left}>
        <FormItem title={'版区名称'}>
          <Input
            wrapClassName={S.input}
            inputValue={secInfo.name}
            onChange={v => changeSecInfo({ name: v })}
          />
        </FormItem>
        <FormItem title={'版主Web5 DID'}>
          <Input wrapClassName={S.input} disabled inputValue={sectionInfo?.owner?.did} />
        </FormItem>
      </div>
      <div className={S.right}>
        <FormItem title={'版区头像'}>
          <UploadAvatar changeLogo={logo => setSecInfo({ logo })} />
        </FormItem>
      </div>
    </div>
    <FormItem title={'版区介绍'} className={S.desc}>
      <TextArea
        wrapClassName={S.textarea}
        inputValue={secInfo.description}
        onChange={v => changeSecInfo({ description: v })}
      />
    </FormItem>
  </ManageModal>
}

export default EditInfoModal;

function FormItem(props: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return <div className={`${S.formItem} ${props.className}`}>
    <p className={S.label}>{props.title}</p>
    {props.children}
  </div>
}