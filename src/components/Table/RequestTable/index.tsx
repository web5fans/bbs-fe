import S from './index.module.scss'
import Table, { TableProps } from "@/components/Table/index";
import { usePagination } from "ahooks";
import BBSPagination from "@/components/BBSPagination";
import { CircleLoading } from "@/components/Loading";
import { useEffect } from "react";

type RequestTableProps<T> = {
  request: (params: { current: number; pageSize: number }) => Promise<{ total: number; list: T[] }>
  defaultPageSize?: number
  refreshDeps?: React.DependencyList
  afterLoading?: () => void
} & Omit<TableProps<T>, 'data'>

export default function RequestTable<T = any>(props: RequestTableProps<T>){
  const { request, defaultPageSize, refreshDeps, ...rest } = props;
  const { data, loading, pagination } = usePagination(request, {
    defaultPageSize,
    refreshDeps,
  })

  useEffect(() => {
    if (loading) return
    props.afterLoading?.()
  }, [loading]);

  return <div className={S.wrap}>
    <div className={'relative'}>
      {loading && <div className={S.loading}>
        <CircleLoading className={S.icon} />
      </div>}
      <Table {...rest} data={data?.list || []} />
    </div>
    <BBSPagination {...pagination} align={'center'} hideOnSinglePage />
  </div>
}