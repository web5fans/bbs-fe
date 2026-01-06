import ManageModal, { FormItem } from "@/components/Modal/ManageModal";
import S from './index.module.scss'
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import { SectionItem } from "@/app/posts/utils";
import UploadSectionAvatar from "../UploadSectionAvatar";
import { useSetState } from "ahooks";
import getSigningKeyInfo from "@/lib/signing-key";
import server from "@/server";
import { useToast } from "@/provider/toast";

const EditInfoModal = (props: {
  onClose: () => void
  sectionInfo?: SectionItem
  refreshDetail: () => void
}) => {
  const { onClose, sectionInfo, refreshDetail } = props;
  const [secInfo, setInfo] = useSetState({
    image: sectionInfo?.image,
    name: sectionInfo?.name,
    description: sectionInfo?.description,
    section: sectionInfo?.id,
    is_disabled: sectionInfo?.is_disabled,
  })

  const toast = useToast()

  const onConfirm = async () => {
    const obj = await getSigningKeyInfo(secInfo)
    if (!obj) return
    await server('/admin/update_section', 'POST', {
      did: obj.did,
      params: obj.format_params,
      signing_key_did: obj.signing_key_did,
      signed_bytes: obj.signed_bytes
    })

    toast({
      title: '版区信息更新成功',
      icon: 'success',
    })

    refreshDetail()
    onClose()
  }

  return <ManageModal
    visible
    title={'编辑版区信息'}
    footer={{
      confirm: {
        disabled: !secInfo.name || !secInfo.description,
        onClick: onConfirm
      },
      cancel: {
        onClick: onClose,
      }
    }}
  >
    <div className={S.container}>
      <div className={S.left}>
        <FormItem title={'版区名称'} className={S.formItem}>
          <Input
            inputValue={secInfo.name}
            onChange={v => setInfo({ name: v })}
          />
        </FormItem>
        <FormItem title={'版主Web5 DID'} className={S.formItem}>
          <Input type={'form'} disabled inputValue={sectionInfo?.owner?.did} />
        </FormItem>
      </div>
      <div className={S.right}>
        <FormItem title={'版区头像'} className={S.formItem}>
          <UploadSectionAvatar
            avatarUrl={secInfo.image}
            changeLogo={url => setInfo({ image: url })}
            classNames={{ wrap: S.uploadWrap, info: S.uploadInfo }}
          />
        </FormItem>
      </div>
    </div>
    <FormItem title={'版区介绍'} className={S.desc}>
      <TextArea
        wrapClassName={S.textarea}
        inputValue={secInfo.description}
        onChange={v => setInfo({ description: v })}
      />
    </FormItem>
  </ManageModal>
}

export default EditInfoModal;