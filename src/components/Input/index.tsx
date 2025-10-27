'use client'

import S from './index.module.scss'
import { JSX, useEffect, useState } from "react";
import SuccessIcon from '@/assets/login/success.svg';
import cx from "classnames";
import setInputCursorPos from "@/components/Input/setInputCursorPos";

type Props = Omit<JSX.IntrinsicElements['input'], 'onChange' | 'value'> & {
  checkedPass?: boolean
  error?: boolean
  children?: React.ReactNode
  wrapClassName?: string
  onChange?: (value: string) => void;
  inputValue?: string
  type?: 'form'
} & ({
  showCount: true;
  onCountCheck: (passed: boolean) => void
} | { showCount: false | undefined; onCountCheck: undefined })

const TEM_SPAN_ID = 'input_mirror'

const Input = (props: Props) => {
  const {
    checkedPass,
    error,
    children,
    wrapClassName,
    showCount,
    inputValue,
    type,
    onCountCheck,
    ...rest
  } = props;
  const [value, setValue] = useState<string | undefined>();
  const [passValidate, setPassValidate] = useState<boolean | undefined>(undefined);
  const { inputRef, caretRef, setCursorPos } = setInputCursorPos(TEM_SPAN_ID);

  useEffect(() => {
    setValue(inputValue)
  }, [inputValue]);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    setCursorPos(e)

    const newValue = e.target.value
    if (showCount) {
      const showValue = newValue.trim()
      const pass = !(showValue.length < (rest.minLength || 0)) && !(showValue.length > (rest.maxLength || 0));
      setPassValidate(pass)
      onCountCheck?.(pass)
    }
    rest.onChange?.(e.target.value)
  }

  return <div
    className={cx(
      S.wrap,
      props.error && S.err,
      props.checkedPass ? S.checkedPass : '',
      showCount && passValidate !== undefined && (passValidate ? S.lengthSuccess : S.err),
      type === 'form' && S.formInput,
      wrapClassName,
      props.disabled && S.disabled,
    )}
  >
    <input
      ref={inputRef}
      type="text"
      name="username"
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck="false"
      inputMode="text"
      {...rest}
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
    {props.checkedPass && <span className={S.icon}>
      <SuccessIcon className={S.icon} />
    </span>}

    {showCount && value !== undefined && <span
      className={S.lengthLimit}
    >{value?.trim().length || 0}/{rest.maxLength}</span>}

    {children}

    <span
      ref={caretRef}
      className={S.caret}
      style={{
        // '--left-deviation': `${hiddenSpanWidth}px`,
      }}
    />
  </div>
}

export default Input;