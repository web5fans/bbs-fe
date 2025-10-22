import S from './index.module.scss'
import Search from "@/components/Input/Search";
import Button from "@/components/Button";
import Table from "@/components/Table";
import { usePagination } from "ahooks";

const TabNotice = () => {

  const columns = [{
    title: '公告内容',
    dataIndex: 'name',
    width: '50%'
  }, {
    title: '发布时间',
    dataIndex: 'type',
  }, {
    title: '操作',
    dataIndex: 'opt',
  }]

  return <div className={S.wrap}>
    <div className={S.header}>
      <Search className={S.search} />
      <Button className={S.newNotice}>发布新公告</Button>
    </div>
    <div>
      <Table
        columns={columns}
        data={[
          {name: '版区规则版区规则版区规则版区规则版区规则版区规则版区规则版', type:'', opt: ''},
          {name: '版区规则版区规则版区规则版区规则版区规则版区规则版区规则版', type:'', opt: ''},
        ]} />
    </div>
  </div>
}

export default TabNotice;