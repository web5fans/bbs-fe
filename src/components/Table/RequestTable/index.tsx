import S from './index.module.scss'
import Table, { TableProps } from "@/components/Table/index";
import { usePagination } from "ahooks";
import BBSPagination from "@/components/BBSPagination";
import { CircleLoading } from "@/components/Loading";
import { useEffect, useImperativeHandle } from "react";
import { PaginationOptions, Data, Params } from "ahooks/lib/usePagination/types";
import { Result } from "ahooks/lib/useRequest/src/types";

type RequestResult<P> = { total: number; list: P[] }
export type RequestTableRef<P> = { mutate: Result<RequestResult<P>, any>['mutate'] }

type RequestTableProps<T> = {
  request: (params: { current: number; pageSize: number }) => Promise<RequestResult<T>>
  requestOptions?: PaginationOptions<Data, Params>
  afterLoading?: () => void
  ref?: React.Ref<RequestTableRef<T>>
} & Omit<TableProps<T>, 'data'>

export default function RequestTable<T>(props: RequestTableProps<T>){
  const { request, requestOptions, afterLoading, ref, ...rest } = props;
  const { data, loading, pagination, mutate } = usePagination(request, {
    ...(requestOptions || {})
  })

  useImperativeHandle(ref, () => ({
    mutate
  }))

  useEffect(() => {
    if (loading) return
    props.afterLoading?.()
  }, [loading]);

  return <div className={S.wrap}>
    <div className={'relative'}>
      {loading && <div className={S.loading}>
        <CircleLoading className={S.icon} />
      </div>}
      <Table {...rest} data={data?.list || []} loading={loading} />
    </div>
    <BBSPagination {...pagination} align={'center'} hideOnSinglePage />
  </div>
}