import S from './index.module.scss'
import { JSX } from "react";

type TableProps<T> = {
  columns: {
    title: string;
    dataIndex: string;
    width?: string;
    render?: (record: T | any, index: number) => any
  }[];
  data: T[]
}

export default function Table<T extends {[key: string]: any}>(props: TableProps<T>): JSX.Element {
  const { columns, data } = props;

  return <table className={S.table}>
    <thead>
    <tr>
      {columns.map((col, cdx) => <th
        style={{ width: col.width }}
        key={`${col.dataIndex}_${cdx}`}
      >{col.title}</th>)}
    </tr>
    </thead>
    <tbody>
      {data.map((d, idx) => <tr>
        {columns.map((col, cdx) => {
          const value = col.render?.(d, idx) || d[col.dataIndex]
          return <td
            key={`r${idx}-c${cdx}`}
          >{value}</td>
        })}
      </tr>)}
    </tbody>
  </table>
}