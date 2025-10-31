import DatePicker, { DatePickerProps, ReactDatePickerCustomHeaderProps } from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import S from './index.module.scss'
import ArrowIcon from '@/assets/arrow.svg';

type Props = Omit<DatePickerProps, 'onChange'> & {
  defaultValue?: Date;
  onChange?: (value: string) => void;
}

const BBSDatePicker = (props: Props) => {
  const { defaultValue, onChange } = props;
  const [selectedDate, setSelectedDate] = useState<Date | undefined | null>(defaultValue || new Date());

  return <DatePicker
    className={S.wrap}
    calendarClassName={S.calender}
    renderCustomHeader={CustomHeader}
    showPopperArrow={true}
    dateFormat={'yyyy/MM/dd hh:mm'}
    timeFormat={'HH:mm'}
    timeCaption={'时间'}
    showTimeSelect
    selected={selectedDate}
    onChange={(date: Date | null) => setSelectedDate(date)}
    startDate={selectedDate}
    onCalendarClose={() => onChange?.(selectedDate)}
    popperPlacement={'bottom-end'}
  />
}

export default BBSDatePicker;

const MONTHS = new Array(12).fill(0).map((_, i) => `${i+1}月`)

function range(start: number, end: number): number[] {
  const nums: number[] = []
  for (let i = start; i < end + 1; i++) {
    nums.push(i)
  }
  return nums
}

const years = range(1990, dayjs().year()) as number[];

const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps) => (
  <div className={S.header}>
    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
      <ArrowIcon className={S.arrowLeft} />
    </button>
    <select
      value={dayjs(date).year()}
      onChange={({ target: { value } }) => changeYear(+value)}
    >
      {years.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>

    <select
      value={MONTHS[dayjs(date).month()]}
      onChange={({ target: { value } }) =>
        changeMonth(MONTHS.indexOf(value as (typeof MONTHS)[number]))
      }
    >
      {MONTHS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>

    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
      <ArrowIcon className={S.arrowRight} />
    </button>
  </div>
);