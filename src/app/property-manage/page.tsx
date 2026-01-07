'use client'

import { LayoutCenter } from "@/components/Layout";
import CardWindow from "@/components/CardWindow";
import S from './index.module.scss'
import { useState } from "react";
import FundInfo from "./_components/FundInfo";
import Tabs from "@/components/Tabs";
import Section from "./_components/TabContents/Section";
import AdminTeam from "./_components/TabContents/AdminTeam";
import SectionAdmin from "./_components/TabContents/SectionAdmin";
import Notice from "./_components/TabContents/Notice";

const page = () => {
  const [activeTab, setActiveTab] = useState(0)

  return <LayoutCenter>
    <CardWindow breadCrumbs={[{ title: '社区管理中心' }]} wrapClassName={S.window} noInnerWrap>
      <div className={S.content}>
        <FundInfo />
        <div className={S.gap} />

        <Tabs onChange={setActiveTab} tabItems={[{ name: '版主管理' }, { name: '版区管理' },{ name: '公告管理' },{ name: '物业团队' }]} >
          {activeTab === 0 && <SectionAdmin />}
          {activeTab === 1 && <Section />}
          {activeTab === 2 && <Notice />}
          {activeTab === 3 && <AdminTeam />}
        </Tabs>
      </div>
    </CardWindow>
  </LayoutCenter>
}

export default page;