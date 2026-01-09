import ManageModal, { FormItem } from "@/components/Modal/ManageModal";
import Input from "@/components/Input";
import { useState } from "react";
import getSigningKeyInfo from "@/lib/signing-key";
import server from "@/server";
import { useToast } from "@/provider/toast";

const AddWhiteList = (props: {
  onClose: () => void
}) => {
  const [did, setDid] = useState('')

  const toast = useToast()

  const addConfirm = async () => {
    const obj = await getSigningKeyInfo({ whitelist: [did] })

    if (!obj) return

    try {
      await server('/admin/add_whitelist', 'POST', {
        did: obj.did,
        params: obj.format_params,
        signed_bytes: obj.signed_bytes,
        signing_key_did: obj.signing_key_did
      })
      toast({ title: '添加成功', icon: 'success' })
      props.onClose()
    } catch (error) {
      toast({ title: '添加失败', icon: 'error' })
    }
  }

  return <ManageModal
    visible
    title={'新增白名单'}
    footer={{
      confirm: {
        disabled: !did,
        onClick: addConfirm
      },
      cancel: {
        onClick: props.onClose
      }
    }}
  >
    <FormItem title={'用户DID'}>
      <Input placeholder={'请输入用户DID'} onChange={setDid} />
    </FormItem>
  </ManageModal>
}

export default AddWhiteList;