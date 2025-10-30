import DatePicker from "@/components/DatePicker";
import S from './index.module.scss'
import { useState } from "react";
import dayjs from "dayjs";

const DateRange = (props: {
  onSearch: (data: {start: string; end: string}) => void
}) => {
  const [dateRange, setDateRange] = useState({
    start: dayjs().format('YYYY-MM-DD HH:mm'),
    end: dayjs().format('YYYY-MM-DD HH:mm')
  })

  const dateChange = (type: 'start' | 'end', value: string) => {
    const range = {
      ...dateRange,
      [type]: value
    }
    const startTime = dayjs(range.start)
    const endTime = dayjs(range.end)
    if (startTime.isBefore(endTime) || startTime.isSame(endTime)) {
      props.onSearch(range)
    }
    setDateRange(range)
  }

  return <div className={S.wrap}>
    <DatePicker onChange={(v) => dateChange('start', v)} />
    -
    <DatePicker onChange={(v) => dateChange('end', v)} />
  </div>
}

export default DateRange;