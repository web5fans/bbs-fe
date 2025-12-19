'use client'

import S from './index.module.scss'
import ManageModal, { FormItem } from "@/components/Modal/ManageModal";
import Select from "@/app/posts/publish/(components)/Select";
import Input from "@/components/Input";
import cx from "classnames";
import { useRequest } from "ahooks";
import { getSectionList } from "@/app/posts/utils";
import { useEffect } from "react";

const AppointModeratorModal = () => {
  const { data: sectionList, run: fetchSections } = useRequest(async () => {
    const result = await getSectionList()
    return result.map(i => ({
      ...i,
      value: i.id.toString(),
      label: i.name,
    }))
  }, {
    manual: true
  })

  useEffect(() => {
    fetchSections()
  }, []);

  return <ManageModal title={'任命版主'} visible={false}>
    <div className={S.modal}>
      <FormItem title={'选择版区'}>
        <Select
          options={sectionList || []}
          onChange={() => {}}
          placeholder={'点击选择版区'}
          className={'!w-full'}
        />
      </FormItem>

      <div className={S.user}>
        <FormItem title={'用户名称'} className={S.formItem}>
          <Input placeholder={'输入用户名称如xbhg'} />
        </FormItem>
        <FormItem title={'用户Web5 DID'} className={cx('!mt-0 flex-1', S.formItem)}>
          <Input placeholder={'输入用户DID'} />
        </FormItem>
      </div>
    </div>
  </ManageModal>
}

export default AppointModeratorModal;