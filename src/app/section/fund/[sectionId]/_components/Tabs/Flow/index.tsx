import S from './index.module.scss'
import SearchCondition from "./components/SearchCondition";
import FlowTypeIcon from "./components/FlowTypeIcon";
import { useSetState } from "ahooks";
import dayjs from "dayjs";
import RequestTable from "@/components/Table/RequestTable";
import server from "@/server";
import { shannonToCkb } from "@/lib/utils";
import UserAvatarInfo from "@/components/UserAvatarInfo";
import { INCOME_STATUS_ENUM, incomeStatusMap, NSID_TYPE_ENUM } from "@/constant/types";
import remResponsive from "@/lib/rem-responsive";
import utcToLocal, { localToUTC } from "@/lib/utcToLocal";
import GoExplorer from "@/components/GoExplorer";
import DistributeStatus from "@/components/DistributeStatus";
import StreamLineRichText from "@/components/StreamLineRichText";
import Link from "next/link";
import { postUriToHref } from "@/lib/postUriHref";

export type SearchParamsType = {
  category: number | string
  start: string
  end: string
}

const Flow = ({ ckbAddr }: {
  ckbAddr: string
}) => {
  const [searchParams, setSearchParams] = useSetState<SearchParamsType>({
    category: 'undefined',
    start: dayjs().startOf('month').format('YYYY/MM/DD') + ' 00:00',
    end: dayjs().add(1, 'month').startOf('month').format('YYYY/MM/DD') + ' 00:00',
  })

  const columns = [{
    title: '类型',
    dataIndex: 'category',
    width: '12%',
    render: (record) => {
      const { category } = record;
      const categoryMap = [{
        short: '分',
        name: '分成收入'
      }, {
        short: '捐',
        name: '捐赠收入'
      }]
      const typeObj = categoryMap[category]
      return <div className={S.flowType}>
        <FlowTypeIcon text={typeObj.short} />
        {typeObj.name}
      </div>
    }
  },{
    title: '金额',
    dataIndex: 'amount',
    width: '18%',
    render: (record) => {
      return <span className={'font-medium text-[#319999]'}>+{shannonToCkb(record.amount)} CKB</span>
    },
  },{
    title: '来源',
    dataIndex: 'src',
    width: '20%',
    render: (record) => {
      const category = record.category
      const source = record.source;
      if (category === 1 || !source) {
        return <UserAvatarInfo
          author={{
            avatar: record.sender_author?.displayName,
            name: record.sender_author?.displayName,
            address: record.sender,
          }}
        />
      }
      const { nsid } = record.source;

      if (nsid === NSID_TYPE_ENUM.POST) {
        const href = '/posts/' + postUriToHref(source.uri)
        return <Link href={href}>
          <div className={S.ellipsis}>{source.title}</div>
        </Link>
      }
      if ([NSID_TYPE_ENUM.POST_COMMENT, NSID_TYPE_ENUM.POST_REPLY].includes(nsid)) {
        return <StreamLineRichText className={S.ellipsis} richText={source.text} postUri={source.post} />
      }
    }
  },{
    title: '状态',
    dataIndex: 'status',
    width: '12%',
    info: <div className={S.tips}>
      <p className={S.title}>待发放状态说明：</p>
      <p className={'whitespace-normal'}>当金额少于 61CKB 时，由 BBS 平台暂时保管，等攒够数额再分发。</p>
    </div>,
    render: (record) => {
      const status = record.status as INCOME_STATUS_ENUM
      return <DistributeStatus status={incomeStatusMap[status]} />
    }
  }, {
    title: '打赏人',
    dataIndex: 'sender',
    width: '18%',
    render: (record) => {

      if (record.category === 1 || !record.sender_author) return '-'
      return <UserAvatarInfo
        author={{
          avatar: record.sender_author?.displayName,
          name: record.sender_author?.displayName,
          address: record.sender,
        }}
      />
    },
  }, {
    title: '时间',
    dataIndex: 'createdAt',
    width: '18%',
    render: (record) => {
      return <div className={S.time}>
        {utcToLocal(record.createdAt, 'YYYY/MM/DD HH:mm')}
        {record.txHash && <GoExplorer hash={record.txHash} />}
      </div>
    }
  }]

  return <div className={S.wrap}>
    <SearchCondition
      searchParams={searchParams}
      setSearchParams={setSearchParams}
    />

    <div className={S.table}>
      <RequestTable
        columns={columns}
        requestOptions={{
          refreshDeps: [searchParams],
        }}
        request={async ({ current, pageSize }) => {
          const result = await server('/tip/income_details', 'POST', {
            did: ckbAddr,
            page: current,
            per_page: pageSize,
            ...searchParams,
            start: localToUTC(searchParams.start),
            end: localToUTC(searchParams.end),
            category: searchParams.category === 'undefined' ? undefined : searchParams.category
          })

          return {
            total: result.total,
            list: result.tips
          }
        }}
        scroll={{ x: remResponsive(500) }}
      />
    </div>
  </div>
}

export default Flow;