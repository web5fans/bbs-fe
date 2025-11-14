'use client'

import S from "./index.module.scss";
import Balance from "./_components/Balance";
import Tabs from "./_components/Tabs";
import DonateModal from "./_components/DonateModal";
import { NSID_TYPE_ENUM } from "@/constant/types";
import { SectionItem } from "@/app/posts/utils";
import { useBoolean } from "ahooks";
import FloatingMark, { useFloatingMarkDistance } from "@/components/FloatingMark";

const Content = ({ section }: {
  section: SectionItem
}) => {
  const [donateVis, setDonateVis] = useBoolean(false)

  const { rootRef, stickyRef } = useFloatingMarkDistance()
  
  return <div className={S.wrap} ref={rootRef}>
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
      nsid={NSID_TYPE_ENUM.SECTION}
      onConfirm={setDonateVis.setFalse}
    />

    <FloatingMark ref={stickyRef} />
  </div>
}

export default Content;