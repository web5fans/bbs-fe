import S from './index.module.scss'
import WaitIcon from '@/assets/fund/distribute-status/wait.svg'
import PendingIcon from '@/assets/fund/distribute-status/pending.svg'
import SuccessIcon from '@/assets/fund/distribute-status/success.svg'
import cx from "classnames";

const statusMap = {
  wait: {
    icon: <WaitIcon />,
    name: '待发放',
    className: S.wait
  },
  pending: {
    icon: <PendingIcon />,
    name: '发放中',
    className: S.pending
  },
  success: {
    icon: <SuccessIcon />,
    name: '已发放',
    className: S.success
  }
}

const DistributeStatus = ({ status, label }: {
  status: 'wait' | 'pending' | 'success'
  label?: string
}) => {
  
  const { icon, name, className } = statusMap[status]
  
  return <div className={cx(S.wrap, className)}>
    {icon}
    {label || name}
  </div>
}

export default DistributeStatus;