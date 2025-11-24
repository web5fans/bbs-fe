import { LayoutCenter } from "@/components/Layout";
import server from "@/server";
import { SectionItem } from "@/app/posts/utils";
import Content from "./Content";

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
    <Content section={section} />
  </LayoutCenter>
}