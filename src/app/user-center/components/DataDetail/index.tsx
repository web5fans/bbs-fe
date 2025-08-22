'use client'

import S from './index.module.scss'
import { useState } from "react";
import UserPosts from "@/app/user-center/components/DataDetail/components/UserPosts";

const tabs = [{
  title: '发帖'
}
// ,{
//   title: '回帖'
// }
]

const DataDetail = (props: { did?: string }) => {
  const { did } = props;
  const [activeTab, setActiveTab] = useState(0)

  return <div className={S.container}>
    <p className={S.header}>数据详情</p>
    <div className={S.tabs}>
      {tabs.map((tab, index) => {
        return <span
          key={index}
          onClick={() => setActiveTab(index)}
          className={activeTab === index ? S.active : ""}
        >{tab.title}</span>
      })}
    </div>
    <div className={S.content}>
      {activeTab === 0 && <UserPosts did={did} />}
    </div>
  </div>
}

export default DataDetail;