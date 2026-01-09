'use client'

import { LayoutCenter } from "@/components/Layout";
import CardWindow from "@/components/CardWindow";
import S from './index.module.scss'
import { useMemo, useState } from "react";
import FundInfo from "./_components/FundInfo";
import Tabs from "@/components/Tabs";
import Section from "./_components/TabContents/Section";
import AdminTeam from "./_components/TabContents/AdminTeam";
import SectionAdmin from "./_components/TabContents/SectionAdmin";
import Notice from "./_components/TabContents/Notice";
import useCurrentUser from "@/hooks/useCurrentUser";
import PageNoAuth from "@/components/PageNoAuth";
import { useRouter } from "next/navigation";

const page = () => {
  const { isAdmin, adminType } = useCurrentUser()
  const [activeTab, setActiveTab] = useState(0)
  const router = useRouter()

  const tabItems = useMemo(() => {
    const tabs = [{ name: '版主管理' }, { name: '版区管理' },{ name: '公告管理' }]
    if (adminType === 'super') {
      tabs.push({ name: '物业团队' })
    }
    return tabs
  }, [adminType])

  if (!isAdmin) {
    return <PageNoAuth
      title={'Ops...你没有权限访问物业管理后台'}
      buttonProps={{ text: '返回社区首页', onClick: () => router.replace('/') }}
      titleClassName={S.authTitle}
    >
      <ul className={S.authUl}>
        <li>P1 - 超级管理员：完全访问权限</li>
        <li>P2 - 物业管理员：部分管理权限</li>
        <li>P3 - 版主：仅版区管理权限</li>
      </ul>
    </PageNoAuth>
  }

  return <LayoutCenter>
    <CardWindow breadCrumbs={[{ title: '社区管理中心' }]} wrapClassName={S.window} noInnerWrap>
      <div className={S.content}>
        <FundInfo />
        <div className={S.gap} />

        <Tabs onChange={setActiveTab} tabItems={tabItems} >
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