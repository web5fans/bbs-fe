import Pagination from "rc-pagination";
import S from './index.module.scss'
import type { PaginationProps } from "rc-pagination/es/interface";

const BBSPagination = (props: PaginationProps) => {
  return <Pagination
    {...props}
    className={S.pagination}
  />
}

export default BBSPagination;