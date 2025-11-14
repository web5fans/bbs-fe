import S from './index.module.scss'
import FlatBottomedCard from "@/components/FlatBottomedCard";
import { shannonToCkb } from "@/lib/utils";
import cx from "classnames";
import { useRequest } from "ahooks";
import server from "@/server";

const SelfOverview = ({ did }: {
  did: string
}) => {
  const { data } = useRequest(async () => {
    return await server('/tip/stats', 'GET', {
      did
    })
  }, {
    ready: !!did
  })

  return <div className={S.wrap}>
    <p className={S.title}>收支概览</p>
    <div className={S.overview}>
      <ReceiptAndPay label={'本月收入'} value={data?.monthlyIncome} />
      <ReceiptAndPay label={'本月支出'} value={data?.monthlyExpense} unit={'-'} />
      <ReceiptAndPay label={'累计收入'} value={data?.totalIncome} />
      <ReceiptAndPay label={'累计支出'} value={data?.totalExpense} unit={'-'} />
    </div>
  </div>
}

export default SelfOverview;

function ReceiptAndPay({
   label,
   value,
   unit = '+'
 }: {
  label: string
  value?: string
  unit?: '-' | '+'
}) {
  return <FlatBottomedCard className={S.itemInfo}>
    <p className={S.label}>{label}</p>
    {value ? <p className={cx(S.value, unit === '+' && S.primary)}>{unit}{shannonToCkb(value)} CKB</p> : <p>-</p>}
  </FlatBottomedCard>
}