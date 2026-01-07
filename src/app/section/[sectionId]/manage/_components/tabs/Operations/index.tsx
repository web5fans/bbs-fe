import RequestTable from "@/components/Table/RequestTable";
import server from "@/server";
import { CommentAllPostType } from "@/app/posts/utils";
import UserAvatarInfo from "@/components/UserAvatarInfo";
import utcToLocal from "@/lib/utcToLocal";
import remResponsive from "@/lib/rem-responsive";

const Operations = ({ sectionId }: { sectionId: string }) => {

  const columns = [{
    title: '操作人',
    dataIndex: 'operator',
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
    dataIndex: 'action'
  },{
    title: '内容',
    dataIndex: 'name'
  },{
    title: '操作时间',
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
    scroll={{ x: remResponsive(300) }}
  />
}

export default Operations;