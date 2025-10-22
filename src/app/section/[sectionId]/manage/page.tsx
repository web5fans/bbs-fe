'use client'

import { LayoutCenter } from "@/components/Layout";
import S from './index.module.scss'
import TabNotice from "./_components/tabs/Notice";
import { useParams } from "next/navigation";
import SectionCard from "./_components/SectionCard";
import { useRequest } from "ahooks";
import server from "@/server";
import { SectionItem } from "@/app/posts/utils";

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

        <div className={S.tabsWrap}>
          <div className={S.tabs}>
            <p className={S.active}>版区公告</p>
            <p>隐藏帖子</p>
            <p>隐藏评论</p>
            <p>操作日志</p>
          </div>
          <div className={S.tabsContent}>
            <TabNotice />

          </div>
        </div>

      </div>

    </div>
  </LayoutCenter>
}

export default page;