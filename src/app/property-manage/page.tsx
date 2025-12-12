import { LayoutCenter } from "@/components/Layout";
import CardWindow from "@/components/CardWindow";
import S from './index.module.scss'
import AppointModeratorModal from "@/app/property-manage/_components/AppointModerator";

const page = () => {
  return <LayoutCenter>
    <CardWindow breadCrumbs={[{ title: '社区管理中心' }]} wrapClassName={S.window} noInnerWrap>
      <div className={S.content}>

        <AppointModeratorModal />
      </div>
    </CardWindow>
  </LayoutCenter>
}

export default page;