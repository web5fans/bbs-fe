import S from './index.module.scss'
import CardWindow from "@/components/CardWindow";
import FileImport from "./FileImport";
import ScanImport from "./ScanImport";
import { usePathname, useRouter } from "next/navigation";
import { useRegisterPopUp } from "@/provider/RegisterPopUpProvider";

const MAIN_STATION_PATH = '/posts'

const ImportDid = (props: {
  windowClassName: string;
  windowTitleClassName: string;
  importType: 'file' | 'scan'
}) => {
  const { windowClassName, windowTitleClassName, importType } = props;
  const { closeRegisterPop } = useRegisterPopUp()
  const router = useRouter()
  const pathname = usePathname()

  const jumpToMain = () => {
    if (pathname === MAIN_STATION_PATH) {
      closeRegisterPop()
      return
    }
    router.replace(MAIN_STATION_PATH)
  }

  return <CardWindow
    header={importType === 'scan' ? '扫一扫登录' : '导入Web5 dID信息'}
    wrapClassName={`${windowClassName} ${S.window}`}
    headerClassName={windowTitleClassName}
    onClose={closeRegisterPop}
    showCloseButton
  >
    {importType === 'file' && (<FileImport jumpToMain={jumpToMain} />)}
    {importType === 'scan' && (<ScanImport jumpToMain={jumpToMain} />)}
  </CardWindow>
}

export default ImportDid;