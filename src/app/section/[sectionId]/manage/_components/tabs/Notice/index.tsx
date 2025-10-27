import S from './index.module.scss'
import Search from "@/components/Input/Search";
import Button from "@/components/Button";
import Table from "@/components/Table";
import { useBoolean, usePagination } from "ahooks";
import NoticeModal from "./NoticeModal";

const TabNotice = () => {

  const [modalVis, setModalVis] = useBoolean(false)

  const columns = [{
    title: '公告内容',
    dataIndex: 'name',
    width: '50%'
  }, {
    title: '发布时间',
    dataIndex: 'type',
    width: '25%'
  }, {
    title: '操作',
    dataIndex: 'opt',
    width: '25%',
    render: () => {
      return <div className={S.options}>
        <a href="">编辑</a>
        <a href="">下架</a>
      </div>
    }
  }]

  return <div className={S.wrap}>
    <div className={S.header}>
      <Search className={S.search} />
      <Button className={S.newNotice} onClick={() => setModalVis.setTrue()}>发布新公告</Button>
    </div>
    <div>
      <Table
        columns={columns}
        data={[
          {name: '版区规则版区规则版区规则版区规则版区规则版区规则版区规则版', type:'', opt: ''},
          {name: '版区规则版区规则版区规则版区规则版区规则版区规则版区规则版', type:'', opt: ''},
        ]} />
    </div>

    <NoticeModal
      visible={modalVis}
      onClose={setModalVis.setFalse}
      refresh={() => {}}
    />
  </div>
}

export default TabNotice;