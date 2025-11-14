import { LayoutCenter } from "@/components/Layout";
import Balance from "./_components/Balance";
import Tabs from "./_components/Tabs";
import S from './index.module.scss'
import server from "@/server";
import { SectionItem } from "@/app/posts/utils";

export default async function Page({
                               params,
                             }: {
  params: Promise<{ sectionId: string }>
}) {
  const { sectionId } = await params
  const section = await server<SectionItem>('/section/detail', 'GET', {
    id: sectionId
  })

  return <LayoutCenter>
    <div className={S.wrap}>
      <Balance section={section} />
      <div className={S.gap} />
      <Tabs section={section} />
    </div>
  </LayoutCenter>
}