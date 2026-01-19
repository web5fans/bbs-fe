'use client'

import ManageModal, { FormItem } from "@/components/Modal/ManageModal";
import S from './index.module.scss'
import Input from "@/components/Input";
import UploadSectionAvatar from "@/app/section/[sectionId]/manage/_components/UploadSectionAvatar";
import TextArea from "@/components/TextArea";
import { useBoolean, useSetState } from "ahooks";
import { useState } from "react";
import server from "@/server";
import getSigningKeyInfo from "@/lib/signing-key";
import { useToast } from "@/provider/toast";
import { ccc } from "@ckb-ccc/core";
import { useWallet } from "@/provider/WalletProvider";

const CreateNewSectionModal = ({ onClose, refresh }: {
  onClose: () => void
  refresh: () => void
}) => {
  const toast = useToast()
  const { walletClient } = useWallet()
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useBoolean(false)
  const [sectionParams, setSectionParams] = useSetState({
    ckb_addr: '',
    description: '',
    image: '',
    name: '',
    owner: '',
  })

  const confirm = async () => {
    const info = await getSigningKeyInfo(sectionParams)
    if (!info) return
    setLoading.setTrue()
    try {
      await ccc.Address.fromString(sectionParams.ckb_addr, walletClient!)
    } catch (err) {
      toast({
        title: '金库地址不合法，请重新输入',
        icon: 'error'
      })
      setLoading.setFalse()
      return
    }

    await server('/admin/create_section', 'POST', {
      did: info.did,
      params: info.format_params,
      signed_bytes: info.signed_bytes,
      signing_key_did: info.signing_key_did
    })
    setLoading.setFalse()
    toast({
      title: '创建成功'
    })
    refresh()
    onClose()
  }

  return <ManageModal
    title={'创建版区'}
    visible
    footer={{
      confirm: {
        disabled: !sectionParams.name || !sectionParams.ckb_addr || !sectionParams.description || !sectionParams.owner || disabled || loading,
        onClick: confirm
      },
      cancel: {
        onClick: onClose
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
              onCountCheck={passed => setDisabled(!passed)}
              onChange={v => setSectionParams({ name: v })}
            />
          </FormItem>
          <FormItem title={'版主Web5 DID'}>
            <Input placeholder={'请输入DID'} onChange={v => setSectionParams({ owner: v })} />
          </FormItem>
        </div>
        <div className={S.right}>
          <FormItem title={'版区头像'}>
            <UploadSectionAvatar changeLogo={(image) => setSectionParams({ image })} classNames={{ wrap: S.uploadWrap, info: S.uploadInfo }} />
          </FormItem>
        </div>
      </div>
      <FormItem title={'金库地址'} className={S.desc}>
        <TextArea placeholder={'请输入金库地址'} onChange={v => setSectionParams({ ckb_addr: v })} />
      </FormItem>
      <FormItem title={'版区介绍'}>
        <TextArea wrapClassName={S.textarea} onChange={v => setSectionParams({ description: v })} />
      </FormItem>
    </div>
  </ManageModal>
}

export default CreateNewSectionModal;