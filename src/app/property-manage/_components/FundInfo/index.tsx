'use client'

import S from './index.module.scss'
import { useBoolean, useRequest } from "ahooks";
import server from "@/server";
import { SectionItem } from "@/app/posts/utils";
import Button from "@/components/Button";
import FlatBottomedCard from "@/components/FlatBottomedCard";
import CopyText from "@/components/CopyText";
import GoExplorer from "@/components/GoExplorer";
import Balance from "@/components/Balance";
import AddWhiteList from "./AddWhiteList";

const FundInfo = () => {
  const { data: section } = useRequest(async () => {
    return await server<SectionItem>('/section/detail', 'GET', {
      id: 0
    })
  })

  const [whiteListVis, setWhiteListVis] = useBoolean(false)

  return <div className={S.wrap}>
    <div className={S.title}>
      <span>金库基金余额</span>
      <Button className={S.whiteButton} onClick={setWhiteListVis.setTrue}>新增白名单</Button>
    </div>
    <div className={S.total}>
      <Balance ckbAddr={section?.ckb_addr} />


      <Button
        className={S.utxo}
        onClick={() => window.open('https://safe.utxo.global', '_blank')}
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

    {whiteListVis && <AddWhiteList onClose={setWhiteListVis.setFalse} />}
  </div>
}

export default FundInfo;