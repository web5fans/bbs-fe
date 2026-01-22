'use client'

import RequestTable from "@/components/Table/RequestTable";
import server from "@/server";
import { SectionItem } from "@/app/posts/utils";
import useCurrentUser from "@/hooks/useCurrentUser";
import S from './index.module.scss'
import UserAvatarInfo from "@/components/UserAvatarInfo";
import { useBoolean } from "ahooks";
import { useRef, useState } from "react";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import getSigningKeyInfo from "@/lib/signing-key";
import { useToast } from "@/provider/toast";
import { TableProps } from "@/components/Table";
import AppointModeratorModal from "../../AppointModerator";
import AddNewSection from "./AddNewSection";

const Section = () => {
  const { userProfile } = useCurrentUser()

  const [v, setV] = useState(0)

  const [confirmVis, setConfirmVis] = useBoolean(false)
  const [appointModalVis, setAppointModalVis] = useBoolean(false)

  const currentSection = useRef<SectionItem | null>(null)

  const toast = useToast()

  const columns: TableProps<SectionItem>['columns'] = [{
    title: '版区名称',
    dataIndex: 'name',
  }, {
    title: '版主',
    dataIndex: 'owner',
    render: (record) => {
      if (!record.owner) return '-'
      return <UserAvatarInfo author={{
        avatar: record.owner?.displayName,
        name: record.owner?.displayName,
        address: record.owner?.did
      }} />

    }
  },{
    title: '帖子数',
    dataIndex: 'post_count',
  },{
    title: '状态',
    dataIndex: 'is_disabled',
    render: (record) => {
      if (!record.owner?.did) {
        return <span className={'underline cursor-pointer'} onClick={() => {
          currentSection.current = record
          setAppointModalVis.setTrue()
        }}>设置版主</span>
      }
      if (record.is_disabled) {
        return <span className={'text-[#9B9B9B] font-medium'}>已隐藏</span>
      }
      return <span className={'text-[var(--primary-color)] font-medium'}>正常</span>
    }
  },{
    title: '操作',
    dataIndex: 'opt',
    render(record) {
      return <a className={'underline cursor-pointer'} onClick={() => {
        currentSection.current = record
        setConfirmVis.setTrue()
      }}>
        {record.is_disabled ? '取消隐藏' : '隐藏'}
      </a>
    }
  }]

  const confirmSection = async () => {
    const info = currentSection.current
    if (!info) return

    const params = {
      section: info.id,
      is_disabled: !info.is_disabled,
      description: null,
      image: null,
      name: null,
    }

    const obj = await getSigningKeyInfo({ ...params, ckb_addr: null })

    if (!obj) return

    await server('/admin/update_section', 'POST', {
      did: obj.did,
      params: obj.format_params,
      signing_key_did: obj.signing_key_did,
      signed_bytes: obj.signed_bytes
    })

    toast({
      title: '操作成功',
      icon: 'success'
    })

    setV(v + 1)
    setConfirmVis.setFalse()
    currentSection.current = null
  }

  return <div className={S.wrap}>
    <div className={S.header}>
      <AddNewSection refresh={() => setV(v => v + 1)} />
    </div>
    <RequestTable
      requestOptions={{
        refreshDeps: [v]
      }}
      request={async () => {
        const result =  await server<SectionItem[]>('/section/list', 'GET', {
          repo: userProfile?.did,
        })
        return {
          list: result,
          total: result.length
        }
      }}
      columns={columns}
    />
    <ConfirmModal
      visible={confirmVis}
      message={currentSection.current?.is_disabled
        ? `确定公开【${currentSection.current?.name}】？公开后，版区所有内容将会出现在BBS论坛，请先确认哦！`
        : `确定隐藏【${currentSection.current?.name}】？隐藏后，版区所有内容将不会出现在BBS论坛，请先确认哦！`
    }
      footer={{
        confirm: {
          onClick: confirmSection,
          text: currentSection.current?.is_disabled ? '确认公开' : '确认隐藏'
        },
        cancel: {
          onClick: () => {
            setConfirmVis.setFalse()
            currentSection.current = null
          },
          text:'再想想'
        }
      }}
    />
    {appointModalVis && <AppointModeratorModal
      defaultSection={currentSection.current?.id}
      refresh={() => setV(v => v + 1)}
      onClose={() => {
        currentSection.current = null
        setAppointModalVis.setFalse()
      }}
    />}
  </div>
}

export default Section;