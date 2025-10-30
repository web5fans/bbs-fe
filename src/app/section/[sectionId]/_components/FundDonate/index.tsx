import Modal from "@/components/Modal";
import CardWindow from "@/components/CardWindow";
import InputNumber from "@/components/Input/InputNumber";
import S from './index.module.scss'

const FundDonate = () => {
  return <Modal visible={false} onlyMask>
    <CardWindow wrapClassName={S.modal}>
      <InputNumber />
    </CardWindow>
  </Modal>
}

export default FundDonate;