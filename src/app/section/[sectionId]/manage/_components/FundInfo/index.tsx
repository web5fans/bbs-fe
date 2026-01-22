'use client'

import S from './index.module.scss'
import { SectionItem } from "@/app/posts/utils";
import Button from "@/components/Button";
import FlatBottomedCard from "@/components/FlatBottomedCard";
import CopyText from "@/components/CopyText";
import GoExplorer from "@/components/GoExplorer";
import Balance from "@/components/Balance";

const FundInfo = ({ section }: {
  section?: SectionItem
}) => {
  return <div className={S.wrap}>
    <p className={S.title}>版区基金余额</p>
    <div className={S.total}>
      <Balance ckbAddr={section?.ckb_addr} />

      <Button
        className={S.utxo}
        onClick={() => window.open('https://safe.utxo.global', '_blank')}
      >进入utxo钱包</Button>
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