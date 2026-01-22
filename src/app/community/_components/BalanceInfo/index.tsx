'use client'

import S from './index.module.scss'
import CardWindow from "@/components/CardWindow";
import Button from "@/components/Button";
import FlatBottomedCard from "@/components/FlatBottomedCard";
import CopyText from "@/components/CopyText";
import { SectionItem } from "@/app/posts/utils";
import GoExplorer from "@/components/GoExplorer";
import { shannonToCkb } from "@/lib/utils";
import { useRequest } from "ahooks";
import server from "@/server";
import Balance from "@/components/Balance";

const BalanceInfo = (props: {
  section: SectionItem
  openDonateModal: () => void
}) => {
  const { section, openDonateModal } = props;

  const { data: statistic } = useRequest(async () => {
    return await server('/tip/stats', 'GET', {
      did: section.ckb_addr
    })
  }, {
    ready: !!section
  })

  const ckbAddr = section.ckb_addr

  return <CardWindow
    wrapClassName={S.cardWindow}
    header={'BBS社区基金'}
  >
    <div className={S.wrap}>
      <p className={S.title}>BBS社区基金金额</p>
      <div className={S.total}>
        <Balance ckbAddr={section?.ckb_addr} />

        <Button
          className={S.donate}
          onClick={openDonateModal}
        >捐赠</Button>
      </div>

      <FlatBottomedCard className={S.address}>
        <div className={S.info}>
          <div className={S.coffers}>
            社区金库多签地址：
            <CopyText text={ckbAddr} ellipsis />
          </div>

          <GoExplorer hash={ckbAddr} subPath={'address'} className={S.go} />
        </div>
      </FlatBottomedCard>

      <div className={S.receiptPay}>
        <ReceiptAndPay label={'本月收入'} value={statistic?.monthlyIncome} />
        <ReceiptAndPay label={'本月支出'} />
        <ReceiptAndPay label={'累计收入'} value={statistic?.totalIncome} />
        <ReceiptAndPay label={'累计支出'} />

      </div>
    </div>
  </CardWindow>
}

export default BalanceInfo;

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
    {value ? <p className={S.value}>{unit}{shannonToCkb(value)} CKB</p> : <p>-</p>}
  </FlatBottomedCard>
}