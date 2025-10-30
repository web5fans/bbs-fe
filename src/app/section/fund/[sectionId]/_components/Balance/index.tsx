'use client'

import S from './index.module.scss'
import CardWindow from "@/components/CardWindow";
import Button from "@/components/Button";
import numeral from "numeral";
import FlatBottomedCard from "@/components/FlatBottomedCard";
import CopyText from "@/components/CopyText";
import GoBrowserIcon from '@/assets/fund/go-browser.svg'

const Balance = () => {
  return <CardWindow
    wrapClassName={S.cardWindow}
    breadCrumbs={[{title: '首页'}, {title: '版区详情'}, { title: '版区基金' }]}
  >
    <div className={S.wrap}>
      <p className={S.title}>【版区名称】<span className={'font-medium'}>基金金额</span></p>
      <div className={S.total}>
        <p className={S.num}>
          <span>{numeral('23393444.872364').format('0,0.[00000000]')}</span>
          <span>CKB</span>
        </p>
        <Button className={S.donate}>捐赠</Button>
      </div>

      <FlatBottomedCard className={S.address}>
        <div className={S.info}>
          <div className={S.coffers}>
            金库多签地址：
            <CopyText text={'qckt1qr97ijbjhsddd6m'} ellipsis />
          </div>

          <GoBrowserIcon className={S.go} />
        </div>
      </FlatBottomedCard>

      <div className={S.receiptPay}>
        <ReceiptAndPay />
        <ReceiptAndPay />
        <ReceiptAndPay />
        <ReceiptAndPay />

      </div>
    </div>
  </CardWindow>
}

export default Balance;

function ReceiptAndPay() {
  return <FlatBottomedCard className={S.itemInfo}>
    <p className={S.label}>本月收入</p>
    <p className={S.value}>+82394785672364857634  CKB</p>
  </FlatBottomedCard>
}