import S from './index.module.scss'
import { useState } from "react";
import dayjs from "dayjs";
import BBSDatePicker from "@/components/BBSDatePicker";

const DateRange = (props: {
  onSearch: (data: {start: string; end: string}) => void
}) => {
  const [dateRange, setDateRange] = useState({
    start: dayjs().format('YYYY-MM-DD HH:mm'),
    end: dayjs().format('YYYY-MM-DD HH:mm')
  })

  const [selectedDate, setStartDate] = useState<Date | null>(
    new Date("2014/02/08"),
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2014/02/10"));

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
    <BBSDatePicker />
    <span className={S.divide}>-</span>
    <BBSDatePicker />
    {/*<DatePicker*/}
    {/*  withPortal*/}
    {/*  showPopperArrow={false}*/}
    {/*  showMonthDropdown*/}
    {/*  showYearDropdown*/}
    {/*  locale={'zh-CN'}*/}
    {/*  selectsStart*/}
    {/*  dateFormat={'yyyy/MM/dd hh:mm'}*/}
    {/*  showTimeInput*/}
    {/*  selected={selectedDate}*/}
    {/*  onChange={(date: Date | null) => setStartDate(date)}*/}
    {/*  startDate={selectedDate}*/}
    {/*  endDate={endDate}*/}
    {/*/>*/}
    {/*<DatePicker*/}
    {/*  dateFormat={'yyyy/MM/dd hh:mm'}*/}
    {/*  selected={endDate}*/}
    {/*  selectsEnd*/}
    {/*  showTimeInput*/}
    {/*  onChange={(date: Date | null) => setEndDate(date)}*/}
    {/*  startDate={selectedDate}*/}
    {/*  endDate={endDate}*/}
    {/*  minDate={selectedDate}*/}
    {/*/>*/}
  </div>
}

export default DateRange;