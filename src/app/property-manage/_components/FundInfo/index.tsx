'use client'

import S from './index.module.scss'
import { useBoolean, useRequest } from "ahooks";
import server from "@/server";
import { SectionItem } from "@/app/posts/utils";
import { ccc } from "@ckb-ccc/core";
import { useWallet } from "@/provider/WalletProvider";
import { shannonToCkb } from "@/lib/utils";
import { DotLoading } from "@/components/Loading";
import numeral from "numeral";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import FlatBottomedCard from "@/components/FlatBottomedCard";
import CopyText from "@/components/CopyText";
import GoExplorer from "@/components/GoExplorer";

const FundInfo = () => {
  const { walletClient } = useWallet()
  const [balanceLoading, setBalanceLoading] = useBoolean(true)
  const [balance, setBalance] = useState('0')

  const { data: section } = useRequest(async () => {
    return await server<SectionItem>('/section/detail', 'GET', {
      id: 0
    })
  })

  const getBalance = async () => {
    if (!section) return
    const addr = await ccc.Address.fromString(section.ckb_addr, walletClient)
    const result = await walletClient?.getBalanceSingle(addr.script)
                                     .finally(() => setBalanceLoading.setFalse())

    setBalance(shannonToCkb(result))
  }

  useEffect(() => {
    getBalance()
  }, [section]);

  return <div className={S.wrap}>
    <p className={S.title}>金库基金余额</p>
    <div className={S.total}>
      {balanceLoading ? <div className={S.loading}>
        获取中<DotLoading />
      </div> : <p className={S.num}>
        <span>{numeral(balance).format('0,0.[00000000]')}</span>
        <span>&nbsp;CKB</span>
      </p>}

      <Button
        className={S.utxo}
      >查看utxo钱包</Button>
    </div>
    <FlatBottomedCard>
      <div className={S.info}>
        <div className={'flex items-center'}>
          <span>金库多签地址：</span>
          <CopyText text={section?.ckb_addr || ''} ellipsis />
        </div>
        <GoExplorer hash={section?.ckb_addr || ''} subPath={'address'} />
      </div>
    </FlatBottomedCard>
  </div>
}

export default FundInfo;