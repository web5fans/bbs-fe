import Button from "@/components/Button";
import RequestTable from "@/components/Table/RequestTable";
import server from "@/server";
import AppointAdminModal from "@/app/property-manage/_components/AppointAdmin";
import { useBoolean } from "ahooks";
import S from './index.module.scss'
import UserAvatarInfo from "@/components/UserAvatarInfo";
import utcToLocal from "@/lib/utcToLocal";
import cx from "classnames";
import { useRef, useState } from "react";
import getSigningKeyInfo from "@/lib/signing-key";
import ConfirmModal from "@/components/Modal/ConfirmModal";

const AdminTeam = () => {
  const [ modalVis, setModalVis ] = useBoolean(false)
  const [ fresh, setFresh ] = useState(0)

  const [confirmModalVis, setConfirmModalVis] = useBoolean(false)
  const currentRecordRef = useRef<any>(null)

  const removeAdmin = async (obj) => {
    const params = await getSigningKeyInfo({ did: obj.did.did, name: obj.did.displayName })
    if (!params) return
    await server('/admin/delete', 'POST', {
      did: params.did,
      params: params.format_params,
      signed_bytes: params.signed_bytes,
      signing_key_did: params.signing_key_did,
    })
    setFresh(v => v + 1)
  }

  const columns = [{
    title: '用户名',
    dataIndex: 'name',
    render(record){
      return <UserAvatarInfo author={{
        address: record.did.did,
        name: record.did.displayName,
        avatar: record.did.displayName,
      }} />
    }
  },{
    title: '权限等级',
    dataIndex: 'permission',
    render(record){
      return <span className={cx('font-medium', record.permission === '0' ? 'text-[var(--primary-color)]' : '')}>
        {['P1 超级管理员', 'P2 物业管理员'][record.permission]}
      </span>
    }
  },{
    title: '任命时间',
    dataIndex: 'created',
    render(record){
      return utcToLocal(record.created, 'YYYY/MM/DD HH:mm')
    }
  },{
    title: '操作',
    dataIndex: 'opt',
    render(record) {
      if (record.permission === '0') return '-'
      return <a
        className={'underline cursor-pointer'}
        onClick={() => {
          currentRecordRef.current = record
          setConfirmModalVis.setTrue()
        }}
      >解除</a>
    }
  }];

  return <div className={S.wrap}>
    <div className={S.header}>
      <Button className={S.button} onClick={setModalVis.setTrue}>任命物业管理</Button>
    </div>
    <RequestTable
      requestOptions={{
        refreshDeps: [fresh]
      }}
      request={async () => {
        const result = await server<any>('/admin', 'GET')
        return {
          list: result,
          total: result.length
        }
      }}
      columns={columns}
    />
    <AppointAdminModal
      onFresh={() => setFresh(v => v + 1)}
      visible={modalVis}
      onClose={setModalVis.setFalse}
    />
    <ConfirmModal
      visible={confirmModalVis}
      message={'确定解任该管理员？'}
      footer={{
        confirm: {
          text: '确定',
          onClick: () => {
            removeAdmin(currentRecordRef.current)
            setConfirmModalVis.setFalse()
          }
        },
        cancel: {
          onClick: () => setConfirmModalVis.setFalse()
        }
      }}
    />
  </div>
}

export default AdminTeam;