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
import Avatar from "@/components/Avatar";
import DistributeStatus from "@/components/DistributeStatus";
import FlowTypeIcon from "@/app/section/fund/[sectionId]/_components/Tabs/Flow/components/FlowTypeIcon";

enum SPENDING_TYPE {
  TIP_POST = 'app.bbs.post',
  TIP_COMMENT = 'app.bbs.comment',
  TIP_REPLY = 'app.bbs.reply',
  DONATE_SECTION = 'app.bbs.section',
  DONATE_COMMUNITY = 'app.bbs.community',
}

const SpendingTab = (props: {
  did: string
}) => {
  const { did } = props;

  const columns = [{
    title: '类型',
    dataIndex: 'name',
    width: '12%',
    render: () => {
      return <div className={'flex items-center whitespace-nowrap'}>
        <FlowTypeIcon text={'捐'} />
         捐赠支出
      </div>
    }
  }, {
    title: '去向',
    dataIndex: 'src',
    width: '20%',
    render: (record) => {
      const source = record.source;
      const nsid = source.nsid;

      if (nsid === SPENDING_TYPE.TIP_POST) return <StreamlineText title={source.title} uri={source.uri} />
      if ([SPENDING_TYPE.TIP_COMMENT, SPENDING_TYPE.TIP_REPLY].includes(nsid)) {
        return <StreamlineText text={source.text} uri={source.post} />
      }
      // if (nsid === SPENDING_TYPE.DONATE_SECTION) {
      //   return <Link href={`/section/${source.id}`}>
      //     <span className={S.text}>{source.name}</span>
      //   </Link>
      // }
      return source.name
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
    dataIndex: 'profileType',
    width: '12%',
    info: <div className={S.tips}>
      <p className={S.title}>待发放状态说明：</p>
      <p className={'whitespace-normal'}>当金额少于 61CKB 时，由 BBS 平台暂时保管，等攒够数额再分发。</p>
    </div>,
    render: () => {
      return <DistributeStatus status={'pending'} />
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
      const { nsid } = record.source;
      if (![SPENDING_TYPE.TIP_POST, SPENDING_TYPE.TIP_COMMENT, SPENDING_TYPE.TIP_REPLY].includes(nsid)) return '-'
      if (!record.receiver_author) return '-'
      return <Receiver author={{...record.receiver_author, address: record.receiver}} />
    },
    align: "center"
  }, {
    title: '时间',
    dataIndex: 'created',
    width: '18%',
    render: (record) => {
      return <div className={S.time}>
        {utcToLocal(record.created, 'YYYY-MM-DD HH:mm')}
        <GoExplorer hash={record.tx_hash} />
      </div>
    }
  }]

  return <RequestTable
    columns={columns}
    request={async ({ current, pageSize }) => {
      const result = await server('/tip/expense_details', 'POST', {
        page: current,
        per_page: pageSize,
        sender_did: did,
      })

      return {
        total: result.total,
        list: result.tips
      }
    }}
    defaultPageSize={10}
    scroll={{ x: remResponsive(500) }}
  />
}

export default SpendingTab;


function StreamlineText({ text, uri, title }: { text?: string; uri: string; title?: string }) {
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

function Receiver({ author }: {
  author: any
}) {
  return <div className={S.userInfo}>
    <Avatar
      nickname={author.displayName}
      className={S.avatar}
    />
    <div className={S.info}>
      <p className={S.name}>{author.displayName}</p>
      <CopyText
        text={author.address}
        ellipsis
        className={{ icon: S.copy, wrap: S.address }}
      />
    </div>
  </div>
}