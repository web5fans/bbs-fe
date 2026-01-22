import ManageModal, { FormItem } from "@/components/Modal/ManageModal";
import Input from "@/components/Input";
import S from './index.module.scss'
import { useSetState } from "ahooks";
import { useToast } from "@/provider/toast";
import getSigningKeyInfo from "@/lib/signing-key";
import server from "@/server";

const AppointAdminModal = (props: {
  visible: boolean
  onClose: () => void
  onFresh: () => void
}) => {
  const { visible, onClose, onFresh } = props;

  const toast = useToast()

  const [form, setForm] = useSetState({
    name: '',
    did: ''
  })

  const onSubmit = async () => {
    const params = await getSigningKeyInfo(form)
    if (!params) return
    try {
      await server('/admin/add', 'POST', {
        did: params.did,
        params: params.format_params,
        signed_bytes: params.signed_bytes,
        signing_key_did: params.signing_key_did,
      })
      onFresh()
      onClose()
    } catch (error: any) {
      const message = error.response.data.message.includes('display name not match') ? '用户名称与DID不匹配' : error.response.data.message
      toast({
        icon: 'error',
        title: message,
      })
    }
  }

  return <ManageModal
    visible={visible}
    title={'任命物业管理员'}
    footer={{
      confirm: {
        text: '确认任命',
        onClick: onSubmit,
        disabled: !form.name || !form.did
      },
      cancel: {
        text: '取消',
        onClick: onClose
      }
    }}
  >
    <div className={S.container}>
      <FormItem title={'用户名称'} className={S.name}>
        <Input placeholder={'输入用户名称'} onChange={v => setForm({ name: v })} />
      </FormItem>
      <FormItem title={'用户Web5 DID'} className={S.did}>
        <Input placeholder={'输入用户DID'} onChange={v => setForm({ did: v })} />
      </FormItem>
    </div>
    <div className={S.content}>
      <p className={S.title}>
        <span>权限说明</span>
        <span>（P2-物业管理员权限）</span>
      </p>
      <ul>
        <li>任命和解除版主</li>
        <li>创建和管理版区</li>
        <li>发布和管理公告</li>
        <li>管理社区基金</li>
      </ul>
    </div>
  </ManageModal>
}

export default AppointAdminModal;