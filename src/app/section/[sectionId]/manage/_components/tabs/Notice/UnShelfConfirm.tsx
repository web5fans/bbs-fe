import { useBoolean } from "ahooks";
import ConfirmModal from "@/components/Modal/ConfirmModal";

const UnShelfConfirm = () => {
  const [confirmModalVis, setConfirmModal] = useBoolean(false)

  return <>
    <a className={'cursor-pointer'} onClick={setConfirmModal.setTrue}>下架</a>

    <ConfirmModal
      visible={confirmModalVis}
      message={'确认下架该公告吗？'}
      footer={{
        confirm: {
          text: '确认下架',
          onClick: () => {}
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