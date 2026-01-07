'use client'

import { LayoutCenter } from "@/components/Layout";
import S from './index.module.scss'
import TabNotice from "./_components/tabs/Notice";
import { useParams } from "next/navigation";
import SectionCard from "./_components/SectionCard";
import { useRequest } from "ahooks";
import server from "@/server";
import { SectionItem } from "@/app/posts/utils";
import Tabs from "@/components/Tabs";
import FundInfo from "./_components/FundInfo";
import { useState } from "react";
import HiddenPosts from "./_components/tabs/HiddenPosts";
import HiddenComments from "./_components/tabs/HiddenComments";
import Operations from "@/app/section/[sectionId]/manage/_components/tabs/Operations";

const page = () => {
  const { sectionId } = useParams<{ sectionId: string }>()

  const [tab, setTab] = useState(0)

  const { data: sectionInfo, refresh: refreshSection } = useRequest(async () => {
    return await server<SectionItem>('/section/detail', 'GET', {
      id: sectionId
    })
  }, {
    ready: !!sectionId,
    refreshDeps: [sectionId]
  })

  return <LayoutCenter>
    <div className={S.wrap}>
      
      <SectionCard sectionInfo={sectionInfo} refreshDetail={refreshSection} />

      <div className={S.content}>
        <FundInfo section={sectionInfo} />
        <div className={S.gap} />
        <Tabs onChange={setTab} tabItems={[{
          name: '版区公告',
        }, {
          name: '隐藏帖子',
        }, {
          name: '隐藏评论',
        },{
          name: '操作日志',
        }]}>
          <div className={S.tabsContent}>
            {tab === 0 && <TabNotice sectionId={sectionId} />}
            {tab === 1 && <HiddenPosts sectionId={sectionId} />}
            {tab === 2 && <HiddenComments sectionId={sectionId} />}
            {tab === 3 && <Operations sectionId={sectionId} />}
          </div>
        </Tabs>

      </div>

    </div>
  </LayoutCenter>
}

export default page;