import RequestTable from "@/components/Table/RequestTable";
import server from "@/server";
import remResponsive from "@/lib/rem-responsive";
import { shannonToCkb } from "@/lib/utils";
import { useEffect, useState } from "react";
import S from './index.module.scss'
import Link from "next/link";
import { postUriToHref } from "@/lib/postUriHref";
import CopyText from "@/components/CopyText";
import utcToLocal from "@/lib/utcToLocal";
import GoExplorer from "@/components/GoExplorer";
import DistributeStatus from "@/components/DistributeStatus";
import FlowTypeIcon from "@/app/section/fund/[sectionId]/_components/Tabs/Flow/components/FlowTypeIcon";
import UserAvatarInfo from "@/components/UserAvatarInfo";
import { NSID_TYPE_ENUM } from "@/constant/types";

const SpendingTab = (props: {
  did: string
  scrollToTop?: () => void
}) => {
  const { did } = props;

  const columns = [{
    title: '类型',
    dataIndex: 'category',
    width: '12%',
    render: (record) => {
      const { category } = record;
      const categoryMap = [{
        short: '支',
        name: '打赏支出'
      }, {
        short: '捐',
        name: '捐赠支出'
      }]
      const typeObj = categoryMap[category]
      return <div className={S.flowType}>
        <FlowTypeIcon text={typeObj.short} />
        {typeObj.name}
      </div>
    }
  }, {
    title: '去向',
    dataIndex: 'src',
    width: '20%',
    render: (record) => {
      const source = record.source;
      if (!source) return '-';
      const nsid = source.nsid;

      if (nsid === NSID_TYPE_ENUM.POST) return <StreamlineText title={source.title} uri={source.uri} />
      if ([NSID_TYPE_ENUM.POST_COMMENT, NSID_TYPE_ENUM.POST_REPLY].includes(nsid)) {
        return <StreamlineText text={source.text} uri={source.post} />
      }
      // if (nsid === SPENDING_TYPE.DONATE_SECTION) {
      //   return <Link href={`/section/${source.id}`}>
      //     <span className={S.text}>{source.name}</span>
      //   </Link>
      // }
      return <span>【{source.name}】</span>
    }
  }, {
    title: '金额',
    dataIndex: 'amount',
    width: '18%',
    render: (record) => {
      return <span className={'font-medium'}>-{shannonToCkb(record.amount)} CKB</span>
    }
  },{
    title: '状态',
    dataIndex: 'status',
    width: '12%',
    render: (record) => {
      const statusMap = {
        1: {
          status: 'pending',
          label: '上链中'
        },
        2: {
          status: 'success',
          label: '已完成'
        }
      }
      return <DistributeStatus {...statusMap[record.status]} />
    }
  },{
    title: '支出钱包地址',
    dataIndex: 'sender',
    render: (record) => {
      return <CopyText text={record.sender} ellipsis className={{ icon: S.copyTextIcon }} />
    }
  },{
    title: '接收人',
    dataIndex: 'receiver',
    width: '18%',
    render: (record) => {
      if (record.category === 1) return '-'
      return <UserAvatarInfo
        author={{
          avatar: record.receiver_author?.displayName,
          name: record.receiver_author?.displayName,
          address: record.receiver,
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
        <GoExplorer hash={record.txHash} />
      </div>
    }
  }]

  return <RequestTable
    columns={columns}
    request={async ({ current, pageSize }) => {
      const result = await server('/tip/expense_details', 'POST', {
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

export default SpendingTab;


export function StreamlineText({ text, uri, title }: { text?: string; uri: string; title?: string }) {
  const [innerRichText, setInnerRichText] = useState('')

  useEffect(() => {
    if (!text) return
    const div = document.createElement("div");
    div.innerHTML = text;
    setInnerRichText(div.innerText)
  }, [text]);

  const href = '/posts/' + postUriToHref(uri || '')

  if (title) {
    return <Link href={href}>
      <div className={S.text}>{title}</div>
    </Link>
  }

  return <Link href={href}>
    <div className={S.text}>{innerRichText}</div>
  </Link>
}