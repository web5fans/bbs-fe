'use client'

import S from './index.module.scss'
import ManageModal, { FormItem } from "@/components/Modal/ManageModal";
import Select from "@/app/posts/publish/(components)/Select";
import Input from "@/components/Input";
import cx from "classnames";
import { useRequest, useSetState } from "ahooks";
import { SectionItem } from "@/app/posts/utils";
import { useEffect } from "react";
import server from "@/server";
import getSigningKeyInfo from "@/lib/signing-key";
import { useToast } from "@/provider/toast";

const AppointModeratorModal = (props: {
  onClose: () => void
  refresh?: () => void
  defaultSection?: string
}) => {
  const toast = useToast()
  const [params, setParams] = useSetState<{ section?: string, did: string, name: string }>({
    section: props.defaultSection,
    did: '',
    name: '',
  })

  const { data: sectionList, run: fetchSections } = useRequest(async () => {
    const result = await server<SectionItem[]>('/section/list', 'GET')
    const noOwner = result.filter(i => !i.owner?.did)
    return noOwner.map(i => ({
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

  const onConfirm = async () => {
    const obj = await getSigningKeyInfo(params)

    if (!obj) return

    try {
      await server('/admin/update_owner', 'POST', {
        did: obj.did,
        params: obj.format_params,
        signing_key_did: obj.signing_key_did,
        signed_bytes: obj.signed_bytes
      }, {
        getWholeResponse: false
      })

      toast({
        title: '操作成功',
      })
      props.refresh?.()
      props.onClose()
    } catch (error: any) {
      if (error.response.data.message.includes('display name not match')) {
        toast({
          icon: 'error',
          title: '用户名称与DID不匹配',
        })
      }
    }
  }

  return <ManageModal
    title={'任命版主'}
    visible
    footer={{
      confirm: {
        disabled: !params.section || !params.did || !params.name,
        onClick: onConfirm
      },
      cancel: {
        onClick: props.onClose
      }
    }}
  >
    <div className={S.modal}>
      <FormItem title={'选择版区'}>
        <Select
          selectedValue={params.section}
          options={sectionList || []}
          onChange={v => setParams({ section: v })}
          placeholder={'点击选择版区'}
          className={'!w-full'}
        />
      </FormItem>

      <div className={S.user}>
        <FormItem title={'用户名称'} className={S.formItem}>
          <Input placeholder={'输入用户名称如xbhg'} onChange={v => setParams({ name: v })} />
        </FormItem>
        <FormItem title={'用户Web5 DID'} className={cx('!mt-0 flex-1', S.formItem)}>
          <Input placeholder={'输入用户DID'} onChange={v => setParams({ did: v })} />
        </FormItem>
      </div>
    </div>
  </ManageModal>
}

export default AppointModeratorModal;