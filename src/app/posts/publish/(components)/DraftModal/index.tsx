import S from './index.module.scss'
import Modal from "@/components/Modal";
import CardWindow from "@/components/CardWindow";
import RequestTable from "@/components/Table/RequestTable";
import server from "@/server";
import useCurrentUser from "@/hooks/useCurrentUser";
import utcToLocal from "@/lib/utcToLocal";
import StreamLineRichText from "@/components/StreamLineRichText";
import remResponsive from "@/lib/rem-responsive";
import cx from "classnames";
import dayjs from "dayjs";
import { postsWritesPDSOperation } from "@/app/posts/utils";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { useBoolean } from "ahooks";
import { useRef, useState } from "react";
import { useToast } from "@/provider/toast";
import { SetPostContentParamsType } from "../DraftSearchParamsWrap";

type DraftModalProps = {
  visible: boolean;
  onClose: () => void;
  continueEdit?: (post: SetPostContentParamsType) => void
  disDeleteDraft?: string[]
}

const DraftModal = (props: DraftModalProps) => {
  const { userProfile } = useCurrentUser()

  const [ confirmVis, setConfirmVis ] = useBoolean(false)
  const curOptRecord = useRef<any>(null)

  const [fresh, setFresh] = useState(0)

  const toast = useToast()

  const deleteDraft = async () => {
    const { uri, created, section_id, title, text } = curOptRecord.current;
    const rkey = uri.split('/app.bbs.post/')[1]

    await postsWritesPDSOperation({
      record: {
        $type: 'app.bbs.post',
        section_id,
        title,
        text,
        edited: dayjs.utc().format(),
        created,
        is_draft: true
      },
      did: userProfile?.did!,
      rkey,
      type: 'delete'
    })
    toast({
      icon: 'success',
      title: '删除成功'
    })
    setFresh(v => v + 1)
    setConfirmVis.setFalse()
  }

  const columns = [{
    title: '帖子草稿',
    dataIndex: 'info',
    width: '45%',
    render: (record) => {
      return <div className={S.info}>
        <p className={cx(S.title, S.ellipsis)}>{record.title || '暂无标题'}</p>
        <StreamLineRichText richText={record.text || '暂无内容'} className={cx(S.content, S.ellipsis)} />
      </div>
    }
  }, {
    title: '版区',
    dataIndex: 'section',
    width: '20%',
  }, {
    title: '上次保存时间',
    dataIndex: 'edited',
    width: '20%',
    render: (record) => {
      return utcToLocal(record.edited || record.created, 'YYYY/MM/DD HH:mm')
    }
  }, {
    title: '操作',
    dataIndex: 'option',
    width: '15%',
    render: (record) => {
      const disUris = props.disDeleteDraft || []
      return <div className={S.options}>
        <a onClick={() => {
          const { title, text, section_id } = record;
          props.continueEdit?.({ ...record, title, text, sectionId: section_id })
          props.onClose()
        }}>继续编辑</a>
        { !disUris.includes(record.uri) && <a onClick={() => {
          curOptRecord.current = record;
          setConfirmVis.setTrue()
        }}>删除</a> }
      </div>
    }
  }]

  return <>
    <Modal visible={props.visible} onlyMask>
      <CardWindow wrapClassName={S.wrap} header={'草稿箱'} showCloseButton onClose={props.onClose}>
        <div className={S.container}>
          <RequestTable
            columns={columns}
            request={async ({ current, pageSize }) => {
              const result = await server<{ posts: any[], total: number }>('/post/list_draft', 'POST', {
                page: current,
                per_page: pageSize,
                repo: userProfile?.did
              })

              return {
                list: result.posts,
                total: result.total,
              }
            }}
            requestOptions={{
              defaultPageSize: 5,
              refreshDeps: [fresh]
            }}
            scroll={{ x: remResponsive(450) }}
          />
        </div>
      </CardWindow>
    </Modal>

    <ConfirmModal
      visible={confirmVis}
      message={'确认删除该草稿吗？'}
      footer={{
        confirm: {
          text: '确认',
          onClick: deleteDraft
        },
        cancel: {
          onClick: setConfirmVis.setFalse
        }
      }}
    />
  </>
}

export default DraftModal;