import S from './index.module.scss'
import Avatar from "@/components/Avatar";
import CopyText from "@/components/CopyText";
import { usePagination } from "ahooks";
import server from "@/server";
import { shannonToCkb } from "@/lib/utils";
import utcToLocal from "@/lib/utcToLocal";
import BBSPagination from "@/components/BBSPagination";
import { CircleLoading } from "@/components/Loading";
import Link from "next/link";
import GoExplorer from "@/components/GoExplorer";

const TipDetailList = (props: {
  uri: string
}) => {
  const {data, loading, pagination, refresh} = usePagination(async ({ current, pageSize }) => {
    const result = await server<{ total: number; tips: any[] }>('/tip/list', 'POST', {
      for_uri: props.uri,
      page: current,
      per_page: pageSize
    })

      return {
        total: result.total,
        list: result.tips
    }
  }, {
    defaultPageSize: 5
  })

  return <div className={S.wrap}>
    <div className={S.tableWrap}>
      {loading && <div className={S.loading}>
        <CircleLoading className={S.icon} />
      </div>}
      <table className={S.table}>
        <thead className={S.header}>
        <tr>
          <th>打赏人（{data?.total || 0}）</th>
          <th>金额</th>
          <th>时间/交易详情</th>
        </tr>
        </thead>
        <tbody>
          {
            data?.list ? data?.list.map(row => {
              const author = row.sender_author
              const href = `/user-center/${encodeURIComponent(row.sender_did)}`
              return <tr>
                <td>
                  <div className={S.userInfo}>
                    <Link href={href}>
                      <Avatar
                        nickname={author.displayName}
                        className={S.avatar}
                      />
                    </Link>
                    <div className={S.info}>
                      <p className={S.name}>{author.displayName}</p>
                      <CopyText
                        text={row.sender}
                        ellipsis
                        className={{ icon: S.copy, wrap: S.address }}
                      />
                    </div>
                  </div>
                </td>
                <td className={S.ckb}>{shannonToCkb(row.amount)} CKB</td>
                <td>
                  <div className={S.time}>
                    <span>{utcToLocal(row.created, 'YYYY/MM/DD HH:mm:ss')}</span>
                    <GoExplorer hash={row['tx_hash']} className={S.icon} />
                  </div>
                </td>
              </tr>
            }) : <Empty />
          }
        </tbody>
      </table>
    </div>
    <BBSPagination {...pagination} hideOnSinglePage className={S.pagination} />
  </div>
}

export default TipDetailList;


function Empty() {
  return <tr>
    <td colSpan={3}>
      <div className={S.empty}>
        暂无数据
      </div>
    </td>
  </tr>
}