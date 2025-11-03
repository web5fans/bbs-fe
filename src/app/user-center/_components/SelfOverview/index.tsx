import S from './index.module.scss'
import FlatBottomedCard from "@/components/FlatBottomedCard";

const SelfOverview = () => {
  return <div className={S.wrap}>
    <p className={S.title}>收支概览</p>
    <div className={S.overview}>
      <ReceiptAndPay />
      <ReceiptAndPay />
      <ReceiptAndPay />
      <ReceiptAndPay />
    </div>
  </div>
}

export default SelfOverview;

function ReceiptAndPay() {
  return <FlatBottomedCard className={S.itemInfo}>
    <p className={S.label}>本月收入</p>
    <p className={S.value}>+82394785672364857634  CKB</p>
  </FlatBottomedCard>
}