import S from './index.module.scss'
import Logo from '@/assets/fund/fund.svg'
import numeral from "numeral";
import Button from "@/components/Button";
import FundDonate from "@/app/section/[sectionId]/_components/FundDonate";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBoolean } from "ahooks";
import { useWallet } from "@/provider/WalletProvider";
import { ccc } from "@ckb-ccc/core";
import { shannonToCkb } from "@/lib/utils";
import { DotLoading } from "@/components/Loading";
import { NSID_TYPE_ENUM } from "@/constant/types";
import DonateModal from "@/app/section/fund/[sectionId]/_components/DonateModal";

const FundEntrance = (props: {
  sectionId: string
  ckbAddr: string
}) => {
  const { ckbAddr } = props;
  const [balance, setBalance] = useState('0')
  const [loading, setLoading] = useBoolean(true)
  const [donateVis, setDonateVis] = useBoolean(false)

  const { walletClient } = useWallet()

  const getBalance = async () => {
    const addr = await ccc.Address.fromString(ckbAddr, walletClient)
    const result = await walletClient?.getBalanceSingle(addr.script)
                                     .finally(() => setLoading.setFalse())

    setBalance(shannonToCkb(result))
  }

  useEffect(() => {
    if (!ckbAddr) return
    getBalance()
  }, [ckbAddr]);

  return <div className={S.wrap}>
    <Link href={`/section/fund/${props.sectionId}`} prefetch>
      <div className={S.top}>
        <div className={S.total}>
          <Logo className={S.logo} />
          {loading ? <div className={S.loading}>
            获取中<DotLoading />
          </div> : <>
            <p className={S.num}>{numeral(balance).format('0.00a')}</p>
            <span className={S.unit}>CKB</span>
          </>}
        </div>
        <div className={S.toDetail}>
          <div className={S.inner}>
            <span>→</span>
            <span>版区基金详情</span>
            <span>←</span>
          </div>
        </div>
      </div>
    </Link>
    <Button
      className={S.donate}
      onClick={setDonateVis.setTrue}
    >捐赠</Button>

    <DonateModal
      visible={donateVis}
      onClose={setDonateVis.setFalse}
      receiveCKBAddr={ckbAddr}
      nsid={NSID_TYPE_ENUM.SECTION}
    />
  </div>
}

export default FundEntrance;