'use client'

import S from './index.module.scss'
import { useEffect, useRef, useState } from "react";
import UserPosts from "./components/UserPosts";
import UserComments from "./components/UserComments";
import { UserProfileType } from "@/store/userInfo";

const tabs = [{
  title: '发帖'
},{
  title: '回帖'
}
]

const SelfDataDetail = (props: { did?: string; profile: UserProfileType }) => {
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
    </div>
  </div>
}

export default SelfDataDetail;