import { CKB_EXPLORER } from "@/constant/explorer";
import TxIcon from "@/assets/tx.svg";
import S from "./index.module.scss";
import cx from "classnames";

const GoExplorer = ({hash, className, subPath = 'transaction'}: { hash: string; className?: string; subPath?: string }) => {
  return <a
    href={`${CKB_EXPLORER}/${subPath}/${hash}`}
    target={'_blank'}
  ><TxIcon className={cx(S.icon, className)} /></a>
}

export default GoExplorer;