import S from './index.module.scss'
import Select from "@/app/posts/publish/(components)/Select";
import cx from "classnames";
import { useSetState } from "ahooks";
import dayjs from "dayjs";
import BBSDatePicker from "@/components/BBSDatePicker";
import Button from "@/components/Button";
import { useEffect, useMemo, useState } from "react";
import { SearchParamsType } from "../../index";

enum DATE_TYPE {
  CURRENT_MONTH,
  LAST_MONTH,
  CUSTOM
}

const SearchCondition = (props: {
  searchParams: SearchParamsType
  setSearchParams: (searchParams: Pick<SearchParamsType, keyof SearchParamsType>) => void
}) => {
  const { searchParams, setSearchParams } = props

  const [dateType, setDateType] = useState<DATE_TYPE>(DATE_TYPE.CURRENT_MONTH)

  const [dateRange, setDateRange] = useSetState({
    start: searchParams.start,
    end: searchParams.end,
  })

  useEffect(() => {
    setDateRange({
      start: searchParams.start,
      end: searchParams.end,
    })
  }, [searchParams.start, searchParams.end]);

  const changeDateType = (type: DATE_TYPE) => {
    setDateType(type)

    if (type === DATE_TYPE.CUSTOM) return

    const defaultDate = {
      [DATE_TYPE.CURRENT_MONTH]: {
        start: dayjs().startOf('month').format('YYYY/MM/DD') + ' 00:00',
        end: dayjs().add(1, 'month').startOf('month').format('YYYY/MM/DD') + ' 00:00',
      },
      [DATE_TYPE.LAST_MONTH]: {
        start: dayjs().subtract(1, 'month').startOf('month').format('YYYY/MM/DD') + ' 00:00',
        end: dayjs().startOf('month').format('YYYY/MM/DD') + ' 00:00',
      }
    }

    setSearchParams(defaultDate[type])
  }

  const searchDis = useMemo(() => {
    return dayjs(searchParams.end).isBefore(dayjs(searchParams.start))
  }, [searchParams])

  const dateEditDis = dateType !== DATE_TYPE.CUSTOM

  return <div className={S.wrap}>
    <Select
      className={S.select}
      selectedValue={searchParams.category}
      placeholder={'类型筛选'}
      onChange={(v) => setSearchParams({ category: v })}
      options={[{
        label: '分成收入',
        value: 0
      },{
        label: '捐赠收入',
        value: 1
      }]}
    />
    <div className={S.dateFilter}>
      <div className={S.dateType}>
        {
          [{
            value: DATE_TYPE.CURRENT_MONTH,
            name: '本月',
          },{
            value: DATE_TYPE.LAST_MONTH,
            name: '上月',
          },{
            value: DATE_TYPE.CUSTOM,
            name: '自定义',
          }].map(each => <span
            key={each.value}
            className={cx(dateType === each.value && S.active)}
            onClick={() => changeDateType(each.value)}
          >{each.name}</span>)
        }
      </div>
      <div className={S.range}>
        <BBSDatePicker
          disabled={dateEditDis}
          selected={new Date(dateRange.start)}
          onChange={v => setDateRange({ start: v })}
        />
        <span className={S.divide}>-</span>
        <BBSDatePicker
          disabled={dateEditDis}
          selected={new Date(dateRange.end)}
          onChange={v => setDateRange({ end: v })}
        />
        {!dateEditDis && <Button
          className={S.search}
          disabled={searchDis}
          onClick={() => {
            setSearchParams(dateRange)
          }}
        >检索</Button>}
      </div>
    </div>
  </div>
}

export default SearchCondition;