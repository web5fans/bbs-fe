import { useBoolean } from "ahooks";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { updatePostByAdmin } from "@/app/posts/utils";
import { useKeystore } from "@/contexts/KeystoreContext";
import { useToast } from "@/provider/toast";

const UnShelfConfirm = ({ uri, refresh }: {
  uri: string
  refresh: () => void
}) => {
  const [confirmModalVis, setConfirmModal] = useBoolean(false)
  const { client, didKey } = useKeystore()

  const toast = useToast()

  const confirm = async () => {
    if (!client || !didKey) return
    await updatePostByAdmin({
      uri,
      is_announcement: false,
      client,
      didKey,
    })
    toast({
      title: '下架成功',
      icon: 'success'
    })
    refresh()
    setConfirmModal.setFalse()
  }

  return <>
    <a className={'cursor-pointer'} onClick={setConfirmModal.setTrue}>下架</a>

    <ConfirmModal
      visible={confirmModalVis}
      message={'确认下架该公告吗？'}
      footer={{
        confirm: {
          text: '确认下架',
          onClick: confirm
        },
        cancel: {
          text: '再想想',
          onClick: setConfirmModal.setFalse
        }
      }}
    />
  </>
}

export default UnShelfConfirm;