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
import { useEffect, useMemo, useState } from "react";
import { ccc } from "@ckb-ccc/core";
import { useWallet } from "@/provider/WalletProvider";
import { useBoolean, useRequest } from "ahooks";
import { DotLoading } from "@/components/Loading";
import server from "@/server";

const Balance = (props: {
  section: SectionItem
  openDonateModal: () => void
}) => {
  const { section, openDonateModal } = props;
  const [balance, setBalance] = useState('0')
  const [loading, setLoading] = useBoolean(true)
  const { walletClient } = useWallet()

  const { data: statistic } = useRequest(async () => {
    return await server('/tip/stats', 'GET', {
      did: section.ckb_addr
    })
  }, {
    ready: !!section
  })

  const ckbAddr = section.ckb_addr

  const getBalance = async () => {
    const addr = await ccc.Address.fromString(section.ckb_addr, walletClient)
    const result = await walletClient?.getBalanceSingle(addr.script)
                                     .finally(() => setLoading.setFalse())

    setBalance(shannonToCkb(result))
  }

  useEffect(() => {
    getBalance()
  }, [section]);

  return <CardWindow
    wrapClassName={S.cardWindow}
    header={'BBS社区基金'}
  >
    <div className={S.wrap}>
      <p className={S.title}>BBS社区基金金额</p>
      <div className={S.total}>
        {loading ? <div className={S.loading}>
          获取中<DotLoading />
        </div> : <p className={S.num}>
          <span>{numeral(balance).format('0,0.[00000000]')}</span>
          <span>CKB</span>
        </p>}

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