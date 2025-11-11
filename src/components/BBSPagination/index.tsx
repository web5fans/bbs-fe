import Pagination from "rc-pagination";
import S from './index.module.scss'
import type { PaginationProps } from "rc-pagination/es/interface";
import cx from "classnames";

const BBSPagination = (props: PaginationProps) => {
  return <Pagination
    {...props}
    className={cx(S.pagination, props.className)}
  />
}

export default BBSPagination;