'use client'

import S from './index.module.scss'
import cx from "classnames";
import Flow from "./Flow";
import IncomeDetail from "@/app/section/fund/[sectionId]/_components/Tabs/IncomeDetail";
import { SectionItem } from "@/app/posts/utils";

const FundTabs = (props: {
  section: SectionItem
}) => {
  const { section } = props;

  return <div className={S.wrap}>
    <div className={S.tabs}>
      <p className={cx(S.tab, S.active)}>收入详情</p>
    </div>
    <div className={S.content}>
      <Flow ckbAddr={section.ckb_addr} />
      {/*<IncomeDetail />*/}
    </div>
  </div>
}

export default FundTabs;