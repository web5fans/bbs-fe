import S from './index.module.scss'
import { SectionItem } from "@/app/posts/utils";
import BreadCrumbs from "@/components/BreadCrumbs";
import CardWindow from "@/components/CardWindow";
import SectionInfo from "@/app/section/[sectionId]/_components/SectionDetailCard/SectionInfo";
import Button from "@/components/Button";
import { useState } from "react";
import EditInfoModal from "../EditInfoModal";

const SectionCard = (props: {
  sectionInfo?: SectionItem
  refreshDetail: () => void
}) => {
  const { sectionInfo, refreshDetail } = props;

  const [visible, setVisible] = useState(false)

  return <CardWindow
    wrapClassName={S.wrap}
    headerExtra={<BreadCrumbs
      className={S.breadCrumb}
      breads={[{
        title: '版区详情',
        route: `/section/${sectionInfo?.id}`
      }, {
        title: '版区管理'
      }]}
    />}
  >
    <div className={S.innerWrap}>
      <SectionInfo sectionInfo={sectionInfo} />

      <div className={S.buttonWrap}>
        <Button
          className={S.button}
          onClick={() => setVisible(true)}
        >
          编辑
        </Button>
      </div>
    </div>

    <EditInfoModal
      visible={visible}
      refreshDetail={refreshDetail}
      onClose={() => setVisible(false)}
      sectionInfo={sectionInfo}
    />
  </CardWindow>
}

export default SectionCard;