import RequestTable from "@/components/Table/RequestTable";
import server from "@/server";
import { CommentAllPostType } from "@/app/posts/utils";
import UserAvatarInfo from "@/components/UserAvatarInfo";
import utcToLocal from "@/lib/utcToLocal";
import remResponsive from "@/lib/rem-responsive";
import StreamLineRichText from "@/components/StreamLineRichText";

enum OPERATION_ACTION_TYPE_ENUM {
  Default = 0,
  DisablePost,
  EnablePost,
  DisableComment,
  EnableComment,
  DisableReply,
  EnableReply,
  DisableSection,
  EnableSection,
  UpdateSectionName,
  UpdateSectionDescription,
  UpdateSectionImage,
  UpdateSectionCkbAddr,
  SetAnnouncement,
  CancelAnnouncement,
  SetTop,
  CancelTop,
  AddWhitelist,
  DeleteWhitelist,
  AddAdmin,
  DeleteAdmin,
}

const Operations = ({ sectionId }: { sectionId: string }) => {

  const showRecordContent = (record) => {
    const { target, action_type } = record;

    const type = Number(action_type)

    if ([
      OPERATION_ACTION_TYPE_ENUM.DisablePost,
      OPERATION_ACTION_TYPE_ENUM.EnablePost,
      OPERATION_ACTION_TYPE_ENUM.SetTop,
      OPERATION_ACTION_TYPE_ENUM.CancelTop,
      OPERATION_ACTION_TYPE_ENUM.SetAnnouncement,
      OPERATION_ACTION_TYPE_ENUM.CancelAnnouncement,
    ].includes(type)) {
      return <p className={'truncate'}>{target.title}</p>
    }
    if ([
      OPERATION_ACTION_TYPE_ENUM.DisableComment,
      OPERATION_ACTION_TYPE_ENUM.EnableComment,
      OPERATION_ACTION_TYPE_ENUM.DisableReply,
      OPERATION_ACTION_TYPE_ENUM.EnableReply,
    ].includes(type)) {
      return <StreamLineRichText richText={target.text} className={'truncate'} />
    }

    return '-'
  }

  const columns = [{
    title: '操作人',
    dataIndex: 'operator',
    width: '18%',
    render(record) {
      const info = record.operator
      return <UserAvatarInfo author={{
        avatar: info.displayName,
        name: info.displayName,
        address: info.did
      }} />
    }
  },{
    title: '操作类型',
    dataIndex: 'action',
    width: '34%',
    render(row) {
      const target = row.target
      const actionNames = ['', '隐藏帖子', '公开帖子', '隐藏评论', '公开评论','隐藏回复','公开回复','隐藏回复','隐藏版区', '公开版区']
      return <p className={'truncate'}>
        {actionNames[row.action_type] || row.action} {target.is_disabled ? `原因：${target.reasons_for_disabled}离开家阿斯蒂芬计划卡机收到回复` : ''}
      </p>
    }
  },{
    title: '内容',
    width: '32%',
    dataIndex: 'target',
    render(record) {
      return showRecordContent(record)
    }
  },{
    title: '操作时间',
    width: '16%',
    dataIndex: 'created',
    render(record) {
      return utcToLocal(record.created, 'YYYY/MM/DD HH:mm')
    }
  }]

  return <RequestTable
    columns={columns}
    request={async ({ current, pageSize }) => {
      const result = await server<{ comments: CommentAllPostType[], total: number }>('/admin/operations', 'GET', {
        page: current,
        per_page: pageSize,
        section: sectionId
      })
      return {
        total: result.total,
        list: result.comments
      }
    }}
    scroll={{ x: remResponsive(500) }}
  />
}

export default Operations;