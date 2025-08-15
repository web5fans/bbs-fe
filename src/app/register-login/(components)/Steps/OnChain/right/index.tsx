import Droppable from "@/app/register-login/(components)/Droppable";
import S from './index.module.scss'
import ChainIcon from '@/assets/login/chain.svg'
import WalletInfo from "./WalletInfo";

export const OnChainRight = (props: {
  hasErr?: boolean
}) => {
  return <div className={S.wrap}>
    <div className={S.chain}>
      <ChainIcon />
      CKB链
    </div>
    <Droppable hasErr={props.hasErr} />

    <div className={S.walletOur}>
      <WalletInfo />
    </div>
  </div>
}