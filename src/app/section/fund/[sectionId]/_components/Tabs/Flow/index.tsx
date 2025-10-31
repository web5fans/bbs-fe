import S from './index.module.scss'
import SearchCondition from "./components/SearchCondition";
import Table from "@/components/Table";
import FlowTypeIcon from "./components/FlowTypeIcon";

const Flow = () => {
  const columns = [{
    title: '类型',
    dataIndex: 'name',
    render: () => {
      return <div>
        <FlowTypeIcon />
      </div>
    }
  },{
    title: '金额',
    dataIndex: 'name',
    render: () => {
      return <span className={'whitespacenowrap'}>+12.12345678 CKB</span>
    },
    info: '22'
  },{
    title: '来源',
    dataIndex: 'name',
    render: () => {
      return <div className={'whitespacenowrap'}>Web5 技术是什么呀可以和我说说吗？</div>
    }
  },{
    title: '时间',
    dataIndex: 'name',
    render: () => {
      return <div>
        2023/12/11 12:11
      </div>
    }
  }]

  return <div className={S.wrap}>
    <SearchCondition />

    <div className={S.table}>
      <Table columns={columns} data={[{}, {}, {}]} />
    </div>
  </div>
}

export default Flow;