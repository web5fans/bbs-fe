'use client'

import S from './index.module.scss'
import { useEffect, useRef, useState } from "react";
import UserPosts from "./components/UserPosts";
import UserComments from "./components/UserComments";
import { UserProfileType } from "@/store/userInfo";
import IncomeTab from "@/app/user-center/_components/DataDetail/components/IncomeTab";
import SpendingTab from "@/app/user-center/_components/DataDetail/components/SpendingTab";

const tabs = [{
  title: '发帖'
},{
  title: '回帖'
}, {
  title: '收入明细'
}, {
  title: '支出明细'
}
]

const SelfDataDetail = (props: { did: string; profile: UserProfileType }) => {
  const { did, profile } = props;
  const [activeTab, setActiveTab] = useState(0)

  const ref = useRef<HTMLDivElement>(null);

  const startChangeTab = useRef(false)

  const scrollToTop = () => {
    if(!ref.current || !startChangeTab.current) return
    const top = ref.current.offsetTop;
    window.scrollTo({top, behavior: 'smooth'} )
  }

  return <div className={S.container} ref={ref}>
    <p className={S.header}>数据详情</p>
    <div className={S.tabs}>
      {tabs.map((tab, index) => {
        return <span
          key={index}
          onClick={() => {
            setActiveTab(index)
            startChangeTab.current = true
          }}
          className={activeTab === index ? S.active : ""}
        >{tab.title}</span>
      })}
    </div>
    <div className={S.content}>
      {activeTab === 0 && <UserPosts did={did} scrollToTop={scrollToTop} />}
      {activeTab === 1 && <UserComments did={did} commentName={profile.displayName} scrollToTop={scrollToTop} />}
      {activeTab === 2 && <IncomeTab />}
      {activeTab === 3 && <SpendingTab did={did} />}
    </div>
  </div>
}

export default SelfDataDetail;