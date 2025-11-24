import S from './index.module.scss'
import Table from "@/components/Table";
import SuccessIcon from '@/assets/fund/distribute-status/success.svg'
import remResponsive from "@/lib/rem-responsive";

const IncomeDetail = () => {
  const columns = [{
    title: '收入来源',
    dataIndex: 'src',
    width: '21%',
  }, {
    title: '分成金额',
    dataIndex: 'count',
    width: '20%',
    info: <div className={S.tips}>
      <p className={S.title}>分成规则说明： </p>
      <p>创作者获得 70% 打赏金额；</p>
      <p>版区金库获得 20% 打赏金额；</p>
      <p>社区金库获得 10% 打赏金额。</p>
    </div>,
    render: () => {
      return '+1243134234 CKB'
    }
  }, {
    title: '状态',
    dataIndex: 'status',
    info: <div className={S.tips}>
      <p className={S.title}>待发放状态说明：</p>
      <p>当金额少于 61CKB 时，由 BBS 平台暂时保管，等攒够数额再分发。</p>
    </div>,
    render: () => {
      return <div className={'flex items-center'}>
        <SuccessIcon />
        已发放
      </div>
    }
  }, {
    title: '打赏人',
    dataIndex: 'name',
    width: '25%',
  }, {
    title: '时间',
    dataIndex: 'time',
    width: '19%',
  }]

  return <Table
    columns={columns}
    data={[{ status: '发放' }]}
    scroll={{ x: remResponsive(431) }}
  />
}

export default IncomeDetail;