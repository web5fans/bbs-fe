import S from './index.module.scss'
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import cx from "classnames";

const TIME_FORMAT  = 'YYYY-MM-DD HH:mm'

const DatePicker = ({ onChange, className = '', disabled, dateTime }: {
  onChange: (utcDate: string) => void;
  className?: string
  disabled?: boolean
  dateTime?: string
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const [valueT, setValueT] = useState('')

  useEffect(() => {
    const formatValue = dayjs(dateTime).format(TIME_FORMAT)
    setValue(formatValue)
  }, [dateTime]);


  return <div className={cx(S.wrap, disabled && S.disabled)}>
    <input
      readOnly={disabled}
      value={value}
      type="datetime-local"
      className={`${S.date} ${className}`}
      ref={inputRef}
      onClick={() => {
        inputRef.current?.showPicker()
      }}
      onBlur={e => {
        onChange(dayjs(value).utc().format())
      }}
      onChange={e => {
        let newValue = e.target.value
        setValueT(newValue)

        if (!newValue) {
          newValue = dayjs().format(TIME_FORMAT)
        }
        setValue(newValue)
      }}
    />
    {valueT}
  </div>
}

export default DatePicker;