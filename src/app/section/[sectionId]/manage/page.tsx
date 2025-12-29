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

const page = () => {
  const { sectionId } = useParams()

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
        <Tabs tabItems={[{
          name: '版区公告',
          value: 'notice'
        }, {
          name: '隐藏帖子',
          value: 'hiddenPost'
        }, {
          name: '隐藏评论',
          value: 'hiddenComment'
        },{
          name: '操作日志',
          value: 'operation'
        }]}>
          <div className={S.tabsContent}>
            <TabNotice />

          </div>
        </Tabs>

      </div>

    </div>
  </LayoutCenter>
}

export default page;