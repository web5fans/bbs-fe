import { CKB_EXPLORER } from "@/constant/explorer";
import TxIcon from "@/assets/tx.svg";
import S from "./index.module.scss";
import cx from "classnames";

const GoExplorer = ({hash, className}: { hash: string; className?: string }) => {
  return <a
    href={`${CKB_EXPLORER}/transaction/${hash}`}
    target={'_blank'}
  ><TxIcon className={cx(S.icon, className)} /></a>
}

export default GoExplorer;