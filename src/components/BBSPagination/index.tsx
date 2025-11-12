import Pagination from "rc-pagination";
import S from './index.module.scss'
import type { PaginationProps } from "rc-pagination/es/interface";
import cx from "classnames";
import NextIcon from '@/assets/pagination/right-arrow.svg'

const BBSPagination = (props: PaginationProps) => {
  return <Pagination
    {...props}
    className={cx(S.pagination, props.className)}
    itemRender={(page, type, element) => {
      if (type === 'next') {
        return <div className={S.nextPage}>
          下一页
          <NextIcon className={S.icon} />
        </div>
      }
      if (type === 'prev') {
        return <div className={S.prevPage}>
          <NextIcon className={S.icon} />
          上一页
        </div>
      }
      return element
    }}
  />
}

export default BBSPagination;