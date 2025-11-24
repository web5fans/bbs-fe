import { LayoutCenter } from "@/components/Layout";
import server from "@/server";
import { SectionItem } from "@/app/posts/utils";
import Content from "./Content";

export default async function Page() {
  const section = await server<SectionItem>('/section/detail', 'GET', {
    id: 0
  })

  return <LayoutCenter>
    <Content section={section} />
  </LayoutCenter>
}