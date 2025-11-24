import RequestTable from "@/components/Table/RequestTable";
import server from "@/server";
import remResponsive from "@/lib/rem-responsive";
import { shannonToCkb } from "@/lib/utils";
import S from './index.module.scss'
import utcToLocal from "@/lib/utcToLocal";
import GoExplorer from "@/components/GoExplorer";
import DistributeStatus from "@/components/DistributeStatus";
import FlowTypeIcon from "@/app/section/fund/[sectionId]/_components/Tabs/Flow/components/FlowTypeIcon";
import UserAvatarInfo from "@/components/UserAvatarInfo";
import { INCOME_STATUS_ENUM, incomeStatusMap, NSID_TYPE_ENUM } from "@/constant/types";
import { postUriToHref } from "@/lib/postUriHref";
import Link from "next/link";
import StreamLineRichText from "@/components/StreamLineRichText";

const IncomeTab = (props: {
  did: string
  scrollToTop?: () => void
}) => {
  const { did } = props;

  const columns = [{
    title: '类型',
    dataIndex: 'name',
    width: '12%',
    render: (record) => {
      return <div className={S.flowType}>
        <FlowTypeIcon text={'分'} />
        分成收入
      </div>
    }
  }, {
    title: '来源',
    dataIndex: 'src',
    width: '20%',
    render: (record) => {
      const source = record.source;
      if (!source) return null;
      const nsid = source.nsid;

      if (nsid === NSID_TYPE_ENUM.POST) {
        const href = '/posts/' + postUriToHref(source.uri)
        return <Link href={href}>
          <div className={S.text}>{source.title}</div>
        </Link>
      }
      if ([NSID_TYPE_ENUM.POST_COMMENT, NSID_TYPE_ENUM.POST_REPLY].includes(nsid)) {
        return <StreamLineRichText className={S.text} richText={source.text} postUri={source.post} />
      }
      return '-'
    }
  }, {
    title: '分成金额',
    dataIndex: 'amount',
    width: '18%',
    info: <div className={S.tips}>
      <p className={S.title}>分成规则说明：</p>
      <p>创作者获得 70% 打赏金额；</p>
      <p>版区金库获得 20% 打赏金额；</p>
      <p>社区金库获得 10% 打赏金额。</p>
    </div>,
    render: (record) => {
      return <span className={'font-medium text-[#319999]'}>+{shannonToCkb(record.amount)} CKB</span>
    }
  },{
    title: '状态',
    dataIndex: 'profileType',
    width: '12%',
    info: <div className={S.tips}>
      <p className={S.title}>待发放状态说明：</p>
      <p className={'whitespace-normal'}>当金额少于 61CKB 时，由 BBS 平台暂时保管，等攒够数额再分发。</p>
    </div>,
    render: (record) => {
      const status = record.status as INCOME_STATUS_ENUM
      return <DistributeStatus status={incomeStatusMap[status]} />
    }
  },{
    title: '支出人',
    dataIndex: 'sender',
    width: '18%',
    render: (record) => {
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

  return <RequestTable
    columns={columns}
    request={async ({ current, pageSize }) => {
      const result = await server('/tip/income_details', 'POST', {
        page: current,
        per_page: pageSize,
        did: did,
      })

      return {
        total: result.total,
        list: result.tips
      }
    }}
    scroll={{ x: remResponsive(500) }}
    afterLoading={props.scrollToTop}
  />
}

export default IncomeTab;