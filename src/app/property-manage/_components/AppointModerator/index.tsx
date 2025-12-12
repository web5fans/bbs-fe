'use client'

import S from './index.module.scss'
import ManageModal, { FormItem } from "@/components/Modal/ManageModal";
import Select from "@/app/posts/publish/(components)/Select";
import Input from "@/components/Input";

const AppointModeratorModal = () => {
  return <ManageModal title={'任命版主'} visible>
    <div className={S.modal}>
      <FormItem title={'选择版区'}>
        <Select options={[]} onChange={() => {}} placeholder={'点击选择版区'} className={'!w-full'} />
      </FormItem>

      <div className={S.user}>
        <FormItem title={'用户名称'}>
          <Input placeholder={'输入用户名称如xbhg'} />
        </FormItem>
        <FormItem title={'用户Web5 DID'} className={'!mt-0 flex-1'}>
          <Input placeholder={'输入用户DID'} wrapClassName={S.input} />
        </FormItem>
      </div>
    </div>
  </ManageModal>
}

export default AppointModeratorModal;