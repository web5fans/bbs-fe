import S from './index.module.scss'
import Search from "@/components/Input/Search";
import Button from "@/components/Button";
import { useBoolean } from "ahooks";
import UnShelfConfirm from "./UnShelfConfirm";
import RequestTable from "@/components/Table/RequestTable";
import server from "@/server";
import { PostFeedItemType } from "@/app/posts/utils";
import { useRef, useState } from "react";
import StreamLineRichText from "@/components/StreamLineRichText";
import utcToLocal from "@/lib/utcToLocal";
import { TableProps } from "@/components/Table";
import NoticeModal from "@/app/section/[sectionId]/manage/_components/tabs/Notice/NoticeModal";

const TabNotice = () => {

  const [noticeModalVis, setNoticeModal] = useBoolean(false)

  const [v, setV] = useState(0)
  const [searchContent, setSearchContent] = useState<string | null>(null)

  const editNoticeRef = useRef<PostFeedItemType | null>(null)

  const columns: TableProps<PostFeedItemType>['columns'] = [{
    title: '公告内容',
    dataIndex: 'name',
    width: '50%',
    render(record) {
      return <div className={S.noticeInfo}>
        <p className={S.title}>{record.title}</p>
        <StreamLineRichText richText={record.text} className={S.des} />
      </div>
    }
  }, {
    title: '发布时间',
    dataIndex: 'created',
    width: '25%',
    render(record) {
      return utcToLocal(record.created, 'YYYY-MM-DD HH:mm')
    }
  }, {
    title: '操作',
    dataIndex: 'opt',
    width: '25%',
    render: (record) => {
      return <div className={S.options}>
        <a className={'cursor-pointer'} onClick={() => {
          editNoticeRef.current = record
          setNoticeModal.setTrue()
        }}>编辑</a>
        <UnShelfConfirm
          uri={record.uri}
          refresh={() => {
            setV(v => v + 1)
          }}
        />
      </div>
    }
  }]

  return <div className={S.wrap}>
    <div className={S.header}>
      <Search className={S.search} onSearch={setSearchContent} />
      <Button className={S.newNotice} onClick={() => {
        setNoticeModal.setTrue()
        editNoticeRef.current = null
      }}>发布新公告</Button>
    </div>
    <RequestTable
      requestOptions={{
        refreshDeps: [v, searchContent]
      }}
      request={async ({ current, pageSize }) => {
        const result = await server<{ posts: PostFeedItemType[], total: number }>('/post/page', 'POST', {
          page: current,
          per_page: pageSize,
          is_announcement: true,
          section_id: '0',
          q: searchContent
        })
        return {
          total: result.total,
          list: result.posts
        }
      }}
      columns={columns}
    />

    {noticeModalVis && <NoticeModal
      noticeInfo={editNoticeRef.current}
      sectionId={'0'}
      onClose={setNoticeModal.setFalse}
      refresh={() => {
        setV(v => v + 1)
      }}
    />}
  </div>
}

export default TabNotice;