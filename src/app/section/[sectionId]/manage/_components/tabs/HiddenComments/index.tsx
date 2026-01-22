import RequestTable from "@/components/Table/RequestTable";
import { TableProps } from "@/components/Table";
import { CommentAllPostType, updatePostByAdmin } from "@/app/posts/utils";
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

const HiddenComments = ({ sectionId }: {
  sectionId: string
}) => {
  const [confirmModalVis, setConfirmModalVis] = useBoolean(false)
  const [v, setV] = useState(0)
  const currentCommentRef = useRef<CommentAllPostType | null>(null)
  const [searchContent, setSearchContent] = useState<string | null>(null)

  const toast = useToast()

  const router = useRouter()

  const columns: TableProps<CommentAllPostType>['columns'] = [{
    title: '评论',
    dataIndex: 'title',
    width: '32%',
    render(record) {
      const link = `/section/${sectionId}/${postUriToHref(record.uri)}`
      return <div className={S.info} onClick={() => router.push(link)}>
        <p className={S.title}>{record.title}</p>
        <StreamLineRichText richText={record.comment_text} className={S.des} />
      </div>
    }
  }, {
    title: '隐藏原因',
    dataIndex: 'comment_reasons_for_disabled',
    width: '36%',
    render(record) {
      return <p className={'truncate'}>原因：{record.comment_reasons_for_disabled}</p>
    }
  }, {
    title: '上次操作时间',
    dataIndex: 'updated',
    width: '18%',
    render(record) {
      if (!record.comment_updated) return
      return utcToLocal(record.comment_updated, 'YYYY-MM-DD HH:mm')
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
      >公开评论</a>
    }
  }]

  const publicComment = async () => {
    const info = currentCommentRef.current
    if (!info) return

    await updatePostByAdmin({
      uri: info.comment_uri,
      is_disabled: false,
    })

    toast({
      title: '公开评论成功',
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
        const result = await server<{ posts: CommentAllPostType[], total: number }>('/post/commented_page', 'POST', {
          page: current,
          per_page: pageSize,
          is_disabled: true,
          section_id: sectionId,
          q: searchContent
        })
        return {
          total: result.total,
          list: result.posts
        }
      }}
      scroll={{ x: remResponsive(400) }}
    />
    <ConfirmModal
      visible={confirmModalVis}
      message={'确定公开该评论吗？'}
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