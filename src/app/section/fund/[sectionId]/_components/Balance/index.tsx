'use client'

import S from './index.module.scss'
import CardWindow from "@/components/CardWindow";
import Button from "@/components/Button";
import numeral from "numeral";
import FlatBottomedCard from "@/components/FlatBottomedCard";
import CopyText from "@/components/CopyText";
import { SectionItem } from "@/app/posts/utils";
import GoExplorer from "@/components/GoExplorer";
import { shannonToCkb } from "@/lib/utils";

const Balance = (props: {
  section: SectionItem
}) => {
  const { section } = props;

  const ckbAddr = section.ckb_addr

  return <CardWindow
    wrapClassName={S.cardWindow}
    breadCrumbs={[
      {title: '首页', route: '/posts'},
      {title: '版区详情', route: `/section/${section.id}`},
      { title: '版区基金' },
    ]}
  >
    <div className={S.wrap}>
      <p className={S.title}>【{section.name}】<span className={'font-medium'}>基金金额</span></p>
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
            <CopyText text={ckbAddr} ellipsis />
          </div>

          <GoExplorer hash={ckbAddr} subPath={'address'} className={S.go} />
        </div>
      </FlatBottomedCard>

      <div className={S.receiptPay}>
        <ReceiptAndPay label={'本月收入'} value={'0'} />
        <ReceiptAndPay label={'本月支出'} />
        <ReceiptAndPay label={'累计收入'} value={'0'} />
        <ReceiptAndPay label={'累计支出'} />

      </div>
    </div>
  </CardWindow>
}

export default Balance;

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