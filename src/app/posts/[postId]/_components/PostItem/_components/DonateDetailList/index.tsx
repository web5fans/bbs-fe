import S from './index.module.scss'
import Avatar from "@/components/Avatar";
import CopyText from "@/components/CopyText";
import TxIcon from "@/assets/tx.svg";

const DonateDetailList = () => {
  return <div className={S.wrap}>
      <table className={S.table}>
        <thead className={S.header}>
        <tr>
          <th>打赏人（31）</th>
          <th>金额</th>
          <th>时间/交易详情</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <div className={S.userInfo}>
              <Avatar nickname={'nick'} className={S.avatar} />
              <div className={S.info}>
                <p className={S.name}>semmx</p>
                <div className={S.address}>
                  qckt1qr...dd6m
                  <CopyText text={'address'} className={S.copy} />
                </div>
              </div>
            </div>
          </td>
          <td className={S.ckb}>23 ckb</td>
          <td>
            <div className={S.time}>
              <span>2025/02/22 23:23:22</span>
              <TxIcon className={S.icon} />
            </div>
          </td>
        </tr>
        </tbody>
      </table>
  </div>
}

export default DonateDetailList;