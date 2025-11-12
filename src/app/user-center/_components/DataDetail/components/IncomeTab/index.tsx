import Table from "@/components/Table";
import remResponsive from "@/lib/rem-responsive";

const IncomeTab = () => {

  const columns = [{
    title: '类型',
    dataIndex: 'name',
  }, {
    title: '来源',
    dataIndex: 'profile',
  }, {
    title: '金额',
    dataIndex: 'name',
  },{
    title: '状态',
    dataIndex: 'profileType',
  },{
    title: '支出人',
    dataIndex: 'profileType',
  },{
    title: '时间',
    dataIndex: 'profileType',
  }]

  return <Table columns={columns} data={[]} scroll={{ x: remResponsive(600) }} />
}

export default IncomeTab;