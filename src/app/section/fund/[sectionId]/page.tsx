import { LayoutCenter } from "@/components/Layout";
import Balance from "./_components/Balance";
import Tabs from "./_components/Tabs";

export default async function Page({
                               params,
                             }: {
  params: Promise<{ sectionId: string }>
}) {
  const { sectionId } = await params

  return <LayoutCenter>
    <Balance />

    <Tabs />
  </LayoutCenter>
}