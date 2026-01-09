import RequestTable from "@/components/Table/RequestTable";
import { TableProps } from "@/components/Table";
import { PostFeedItemType, updatePostByAdmin } from "@/app/posts/utils";
import server from "@/server";
import utcToLocal from "@/lib/utcToLocal";
import remResponsive from "@/lib/rem-responsive";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { useBoolean } from "ahooks";
import { useRef, useState } from "react";
import { useToast } from "@/provider/toast";
import Search from "@/components/Input/Search";
import S from './index.module.scss'
import { useRouter } from "next/navigation";
import { postUriToHref } from "@/lib/postUriHref";

const HiddenPosts = ({ sectionId }: {
  sectionId: string
}) => {
  const [confirmModalVis, setConfirmModalVis] = useBoolean(false)
  const [v, setV] = useState(0)
  const currentPostRef = useRef<PostFeedItemType | null>(null)
  const [searchContent, setSearchContent] = useState<string | null>(null)

  const toast = useToast()

  const router = useRouter()

  const columns: TableProps<PostFeedItemType>['columns'] = [{
    title: '帖子',
    dataIndex: 'title',
    width: '32%',
    render(record) {
      return <p
        className={'font-medium truncate underline cursor-pointer'}
        onClick={() => router.push(`/section/${sectionId}/${postUriToHref(record.uri)}`)}
      >{record.title}</p>
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
    dataIndex: 'edited',
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
          currentPostRef.current = record;
          setConfirmModalVis.setTrue()
        }}
      >公开帖子</a>
    }
  }]

  const publicPost = async () => {
    const postInfo = currentPostRef.current
    if (!postInfo) return

    await updatePostByAdmin({
      uri: postInfo.uri,
      is_disabled: false,
    })

    toast({
      title: '公开帖子成功'
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
        const result = await server<{ posts: PostFeedItemType[], total: number }>('/post/page', 'POST', {
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
      message={'确定公开该帖子吗？'}
      footer={{
        confirm: {
          onClick: publicPost
        },
        cancel: {
          onClick: setConfirmModalVis.setFalse
        }
      }}
    />
  </div>
}

export default HiddenPosts;