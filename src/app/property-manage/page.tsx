import { LayoutCenter } from "@/components/Layout";
import CardWindow from "@/components/CardWindow";
import S from './index.module.scss'
import AppointModeratorModal from "./_components/AppointModerator";
import CreateNewSectionModal from "./_components/CreateNewSection";
import AppointAdminModal from "./_components/AppointAdmin";
import FundInfo from "./_components/FundInfo";
import Tabs from "@/components/Tabs";

const page = () => {
  return <LayoutCenter>
    <CardWindow breadCrumbs={[{ title: '社区管理中心' }]} wrapClassName={S.window} noInnerWrap>
      <div className={S.content}>
        <FundInfo />
        <div className={S.gap} />

        {/*<AppointModeratorModal />*/}
        {/*<CreateNewSectionModal />*/}
        {/*<AppointAdminModal />*/}
        <Tabs tabItems={[{ name: '版主管理' }, { name: '版区管理' },{ name: '公告管理' },{ name: '物业团队' }]} >
          <div>
            content
          </div>
        </Tabs>
      </div>
    </CardWindow>
  </LayoutCenter>
}

export default page;