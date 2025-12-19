'use client'

import ManageModal, { FormItem } from "@/components/Modal/ManageModal";
import S from './index.module.scss'
import Input from "@/components/Input";
import UploadSectionAvatar from "@/app/section/[sectionId]/manage/_components/UploadSectionAvatar";
import TextArea from "@/components/TextArea";

const CreateNewSectionModal = () => {
  return <ManageModal
    title={'创建版区'}
    visible={false}
    footer={{
      confirm: {
        text: '确认任命'
      }
    }}
  >
    <div className={S.modal}>
      <div className={S.info}>
        <div className={S.left}>
          <FormItem title={'版区名称'}>
            <Input
              placeholder={'请输入版区名称'}
              minLength={1}
              maxLength={50}
              showCount
              onCountCheck={() => {}}
            />
          </FormItem>
          <FormItem title={'版主Web5 DID'}>
            <Input placeholder={'请输入DID'} />
          </FormItem>
        </div>
        <div className={S.right}>
          <FormItem title={'版区头像'}>
            <UploadSectionAvatar changeLogo={() => {}} classNames={{ wrap: S.uploadWrap, info: S.uploadInfo }} />
          </FormItem>
        </div>
      </div>
      <FormItem title={'版区介绍'} className={S.desc}>
        <TextArea wrapClassName={S.textarea} />
      </FormItem>
    </div>
  </ManageModal>
}

export default CreateNewSectionModal;