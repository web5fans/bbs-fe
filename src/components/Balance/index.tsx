'use client'

import S from './index.module.scss'
import { useWallet } from "@/provider/WalletProvider";
import { useBoolean } from "ahooks";
import { useEffect, useState } from "react";
import { ccc } from "@ckb-ccc/core";
import { shannonToCkb } from "@/lib/utils";
import { DotLoading } from "@/components/Loading";
import numeral from "numeral";

const Balance = ({ ckbAddr }: {
  ckbAddr?: string
}) => {
  const { walletClient } = useWallet()
  const [balanceLoading, setBalanceLoading] = useBoolean(true)
  const [balance, setBalance] = useState('0')

  const getBalance = async () => {
    if (!ckbAddr || !walletClient) return
    const addr = await ccc.Address.fromString(ckbAddr, walletClient)
    const result = await walletClient?.getBalanceSingle(addr.script)
                                     .finally(() => setBalanceLoading.setFalse())

    setBalance(shannonToCkb(result))
  }

  useEffect(() => {
    getBalance()
  }, [ckbAddr]);

  return <>
    {balanceLoading ? <div className={S.loading}>
      获取中<DotLoading />
    </div> : <p className={S.num}>
      <span>{numeral(balance).format('0,0.[00000000]')}</span>
      <span>&nbsp;CKB</span>
    </p>}
  </>
}

export default Balance;