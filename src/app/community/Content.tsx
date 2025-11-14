'use client'

import S from "./index.module.scss";
import Balance from "./_components/Balance";
import Tabs from "./_components/Tabs";
import { NSID_TYPE_ENUM } from "@/constant/types";
import { SectionItem } from "@/app/posts/utils";
import { useBoolean } from "ahooks";
import DonateModal from "@/app/section/fund/[sectionId]/_components/DonateModal";

const Content = ({ section }: {
  section: SectionItem
}) => {
  const [donateVis, setDonateVis] = useBoolean(false)
  
  return <div className={S.wrap}>
    <Balance
      section={section}
      openDonateModal={setDonateVis.setTrue}
    />
    <div className={S.gap} />
    <Tabs section={section} />

    <DonateModal
      visible={donateVis}
      onClose={setDonateVis.setFalse}
      receiveCKBAddr={section.ckb_addr}
      nsid={NSID_TYPE_ENUM.COMMUNITY}
      onConfirm={setDonateVis.setFalse}
    />
  </div>
}

export default Content;