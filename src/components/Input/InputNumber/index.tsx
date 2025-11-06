
import { JSX, useEffect, useState } from "react";
import cx from "classnames";
import setInputCursorPos from "@/components/Input/setInputCursorPos";
import S from './index.module.scss'

type Props = Omit<JSX.IntrinsicElements['input'], 'onChange' | 'value' | 'pattern' | 'onError'> & {
  children?: React.ReactNode
  wrapClassName?: string
  onChange?: (value: string) => void;
  inputValue?: string
  isFormChild?: boolean
  error?: boolean
  pattern?: RegExp
  onError?: () => void
}

const TEM_SPAN_ID = 'input_number_mirror'

const strictDecimalRegex = /^\d*\.?\d*$/;

const InputNumber = (props: Props) => {
  const {
    children,
    wrapClassName,
    inputValue,
    isFormChild,
    error,
    pattern,
    ...rest
  } = props;
  const [value, setValue] = useState<string | undefined>();
  const { inputRef, caretRef, setCursorPos } = setInputCursorPos(TEM_SPAN_ID);

  useEffect(() => {
    setValue(inputValue)
  }, [inputValue]);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    if (!value) {
      setCursorPos(e)
      setValue(value)
      rest.onChange?.(value)
      rest.onError?.()
    }

    const reg = pattern || strictDecimalRegex
    const passed = reg.test(value)

    if (!passed) return

    setCursorPos(e)

    const minNum = props.min || 0

    if (value < minNum) {
      value = minNum.toString()
    }
    setValue(value)
    rest.onChange?.(value)
  }

  return <div
    className={cx(
      S.wrap,
      error && S.err,
      isFormChild && S.formInput,
      wrapClassName,
      props.disabled && S.disabled,
    )}
  >
    <input
      {...rest}
      ref={inputRef}
      type="text"
      name="count"
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck="false"
      inputMode="decimal"
      onKeyDownCapture={setCursorPos}
      onKeyUpCapture={setCursorPos}
      onClick={setCursorPos}
      onChange={inputChange}
      className={rest.className}
      onBlur={() => {
        if (caretRef.current) {
          caretRef.current.style.removeProperty('display');
        }
      }}
      value={value || ''}
    />

    {children}

    <span
      ref={caretRef}
      className={S.caret}
    />
  </div>
}

export default InputNumber;