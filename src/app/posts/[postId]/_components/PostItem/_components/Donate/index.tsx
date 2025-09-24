import { useBoolean } from "ahooks";
import DonateModal from "./DonateModal";
import S from './index.module.scss'

const Donate = () => {
  const [visible, { toggle }] = useBoolean(false)
  return <div>
    <span onClick={toggle} className={S.text}>打赏此贴</span>

    <DonateModal visible={visible} />
  </div>
}

export default Donate;