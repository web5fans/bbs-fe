import RequestTable from "@/components/Table/RequestTable";
import { TableProps } from "@/components/Table";
import { updatePostByAdmin } from "@/app/posts/utils";
import server from "@/server";
import utcToLocal from "@/lib/utcToLocal";
import remResponsive from "@/lib/rem-responsive";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { useBoolean } from "ahooks";
import { useRef, useState } from "react";
import { useToast } from "@/provider/toast";
import Search from "@/components/Input/Search";
import S from './index.module.scss'
import StreamLineRichText from "@/components/StreamLineRichText";
import { postUriToHref } from "@/lib/postUriHref";
import { useRouter } from "next/navigation";


type ReplyItemType = {
  cid: string
  comment: string
  comment_text: string
  created: string
  edited: string
  is_disabled: true
  post: string
  reasons_for_disabled: string
  repo: string
  text: string
  updated: string
  uri: string
}

const HiddenComments = ({ sectionId }: {
  sectionId: string
}) => {
  const [confirmModalVis, setConfirmModalVis] = useBoolean(false)
  const [v, setV] = useState(0)
  const currentCommentRef = useRef<ReplyItemType | null>(null)
  const [searchContent, setSearchContent] = useState<string | null>(null)

  const toast = useToast()

  const router = useRouter()

  const columns: TableProps<ReplyItemType>['columns'] = [{
    title: '回复',
    dataIndex: 'title',
    width: '32%',
    render(record) {
      const link = `/section/${sectionId}/${postUriToHref(record.post)}`
      return <div className={S.info} onClick={() => router.push(link)}>
        <StreamLineRichText richText={record.comment_text} className={S.title} />
        <StreamLineRichText richText={record.text} className={S.des} />
      </div>
    }
  }, {
    title: '隐藏原因',
    dataIndex: 'reasons_for_disabled',
    width: '36%',
    render(record) {
      return <p className={'truncate'}>原因：{record.reasons_for_disabled}</p>
    }
  }, {
    title: '上次操作时间',
    dataIndex: 'updated',
    width: '18%',
    render(record) {
      if (!record.updated) return
      return utcToLocal(record.updated, 'YYYY-MM-DD HH:mm')
    }
  }, {
    title: '操作',
    dataIndex: 'opt',
    width: '14%',
    render(record) {
      return <a
        className={'underline cursor-pointer'}
        onClick={() => {
          currentCommentRef.current = record;
          setConfirmModalVis.setTrue()
        }}
      >公开回复</a>
    }
  }]

  const publicComment = async () => {
    const info = currentCommentRef.current
    if (!info) return

    await updatePostByAdmin({
      uri: info.uri,
      is_disabled: false,
    })

    toast({
      title: '公开回复成功',
      icon: 'success'
    })
    setV(v => v + 1)
    setConfirmModalVis.setFalse()
  }



  return <div className={S.wrap}>
    <Search className={S.search} onSearch={setSearchContent} />
    <RequestTable
      requestOptions={{
        refreshDeps: [v, searchContent]
      }}
      columns={columns}
      request={async ({ current, pageSize }) => {
        const result = await server<{ replies: ReplyItemType[], total: number }>('/reply/page', 'POST', {
          page: current,
          per_page: pageSize,
          is_disabled: true,
          section_id: sectionId,
          q: searchContent
        })
        return {
          total: result.total,
          list: result.replies
        }
      }}
      scroll={{ x: remResponsive(400) }}
    />
    <ConfirmModal
      visible={confirmModalVis}
      message={'确定公开该回复吗？'}
      footer={{
        confirm: {
          onClick: publicComment
        },
        cancel: {
          onClick: setConfirmModalVis.setFalse
        }
      }}
    />
  </div>
}

export default HiddenComments;