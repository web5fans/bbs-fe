'use client'

import Button from "@/components/Button";
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
import utcToLocal from "@/lib/utcToLocal";
import AppointAdminModal from "@/app/property-manage/_components/AppointAdmin";
import AppointModeratorModal from "@/app/property-manage/_components/AppointModerator";

const SectionAdmin = () => {
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
      return <UserAvatarInfo author={{
        avatar: record.owner?.displayName,
        name: record.owner?.displayName,
        address: record.owner?.did
      }} />

    }
  },{
    title: '任命时间',
    dataIndex: 'owner_set_time',
    render(record) {
      if (record.owner?.did && record.owner_set_time) {
        return utcToLocal(record.owner_set_time, 'YYYY-MM-DD HH:mm')
      }
      return '-'
    }
  },{
    title: '状态',
    dataIndex: 'status',
    render: (record) => {
      if (record.owner?.did) {
        return <span className={'text-[var(--primary-color)] font-medium'}>正常</span>
      }
      return <span className={'font-medium'}>空缺</span>
    }
  },{
    title: '操作',
    dataIndex: 'opt',
    render(record) {
      if (!record.owner?.did) {
        return <a
          className={'underline cursor-pointer'}
          onClick={() => {
            currentSection.current = record
            setAppointModalVis.setTrue()
          }}
        >去任命</a>
      }
      return <a className={'underline cursor-pointer'} onClick={() => {
        currentSection.current = record
        setConfirmVis.setTrue()
      }}>
        解任
      </a>
    }
  }]

  const confirmSection = async () => {
    const info = currentSection.current
    if (!info) return

    const params = {
      section: info.id,
      did: null,
      name: null,
    }

    const obj = await getSigningKeyInfo(params)

    if (!obj) return

    await server('/admin/update_owner', 'POST', {
      did: obj.did,
      params: obj.format_params,
      signing_key_did: obj.signing_key_did,
      signed_bytes: obj.signed_bytes
    })

    toast({
      title: '操作成功',
    })

    setV(v + 1)
    setConfirmVis.setFalse()
    setAppointModalVis.setFalse()
    currentSection.current = null
  }

  return <div className={S.wrap}>
    <div className={S.header}>
      <Button className={S.button} onClick={() => {
        setAppointModalVis.setTrue()
        currentSection.current = null
      }}>任命新版主</Button>
    </div>
    <RequestTable
      requestOptions={{
        refreshDeps: [v]
      }}
      request={async () => {
        const result =  await server<SectionItem[]>('/section/list', 'GET', {
          repo: userProfile?.did
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
      message={`确定解任【${currentSection.current?.name}】的版主【${currentSection.current?.owner?.displayName}】`}
      footer={{
        confirm: {
          onClick: confirmSection,
          text: '确认解任'
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
      onClose={setAppointModalVis.setFalse}
      refresh={() => setV(v => v + 1)}
    />}
  </div>
}

export default SectionAdmin;