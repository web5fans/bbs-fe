import S from './index.module.scss'
import { JSX } from "react";
import InfoSVG from '@/assets/info.svg'
import MouseToolTip from "@/components/MouseToolTip";

export type TableProps<T> = {
  columns: {
    title: string | JSX.Element;
    dataIndex: string;
    width?: string;
    render?: (record: T | any, index: number) => any
    info?: string | JSX.Element
    align?: "left" | "center" | 'right'
  }[];
  data: T[];
  scroll?: {
    x: number | string
  }
}

export default function Table<T>(props: TableProps<T>): JSX.Element {
  const { columns, data, scroll } = props;

  return <div className={S.wrap}>
    <table className={S.table} style={{ minWidth: scroll?.x }}>
      <thead>
      <tr>
        {columns.map((col, cdx) => {
          const style = { width: col.width, textAlign: col.align }
          if (col.info) {
            const justifyContent = col.align === 'right' ? 'flex-end' : col.align

            return <th
              style={style}
              key={`${col.dataIndex}_${cdx}`}
            >
              <div className={S.infoWrap} style={{ justifyContent }}>
                {col.title}
                <MouseToolTip message={col.info}>
                  <InfoSVG className={S.icon} />
                </MouseToolTip>
              </div>
            </th>
          }
          return <th
            style={style}
            key={`${col.dataIndex}_${cdx}`}
          >{col.title}</th>
        })}
      </tr>
      </thead>
      <tbody>
      {data.length > 0 ? data.map((d, idx) => <tr>
        {columns.map((col, cdx) => {
          const value = col.render?.(d, idx) || d[col.dataIndex]
          return <td
            style={{ textAlign: col.align }}
            key={`r${idx}-c${cdx}`}
          >{value}</td>
        })}
      </tr>) : <Empty colsNum={columns.length} />}
      </tbody>
    </table>
  </div>
}

function Empty({ colsNum }: { colsNum: number }) {
  return <tr>
    <td colSpan={colsNum}>
      <div className={S.empty}>
        暂无数据
      </div>
    </td>
  </tr>
}