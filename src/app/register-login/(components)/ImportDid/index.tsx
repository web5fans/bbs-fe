import S from './index.module.scss'
import CardWindow from "@/components/CardWindow";
import FileImport from "./FileImport";

const ImportDid = (props: {
  windowClassName: string;
  windowTitleClassName: string;
  importType: 'file' | 'scan'
}) => {
  const { windowClassName, windowTitleClassName } = props;

  return <CardWindow
    header={'导入Web5 dID信息'}
    wrapClassName={`${windowClassName} ${S.window}`}
    headerClassName={windowTitleClassName}
    showCloseButton
  >
    <FileImport />
  </CardWindow>
}

export default ImportDid;