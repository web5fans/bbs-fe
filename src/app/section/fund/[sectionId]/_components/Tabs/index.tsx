'use client'

import S from './index.module.scss'
import cx from "classnames";
import Flow from "./Flow";

const FundTabs = () => {
  return <div className={S.wrap}>
    <div className={S.tabs}>
      <p className={cx(S.tab, S.active)}>流水详情</p>
      <p className={S.tab}>分成收入详情</p>
    </div>
    <div className={S.content}>
      <Flow />
    </div>
  </div>
}

export default FundTabs;