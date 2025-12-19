import ManageModal, { FormItem } from "@/components/Modal/ManageModal";
import Input from "@/components/Input";
import S from './index.module.scss'

const AppointAdminModal = () => {
  return <ManageModal visible title={'任命物业管理员'} >
    <div className={S.container}>
      <FormItem title={'用户名称'} className={S.name}>
        <Input placeholder={'输入用户名称'} />
      </FormItem>
      <FormItem title={'用户Web5 DID'} className={S.did}>
        <Input placeholder={'输入用户DID'} />
      </FormItem>
    </div>
    <div className={S.content}>
      <p className={S.title}>
        <span>权限说明</span>
        <span>（P2-物业管理员权限）</span>
      </p>
      <ul>
        <li>任命和解除版主 (P3)</li>
        <li>创建和管理版区</li>
        <li>发布和管理公告</li>
        <li>管理社区基金</li>
      </ul>
    </div>
  </ManageModal>
}

export default AppointAdminModal;