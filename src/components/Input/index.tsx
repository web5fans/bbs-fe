'use client'

import S from './index.module.scss'
import { JSX, Ref, useEffect, useImperativeHandle, useState } from "react";
import SuccessIcon from '@/assets/login/success.svg';
import cx from "classnames";
import setInputCursorPos from "@/components/Input/setInputCursorPos";

export type InputRefType = {
  setInputValue: (value: string) => void
}

type Props = Omit<JSX.IntrinsicElements['input'], 'onChange' | 'value' | 'ref'> & {
  checkedPass?: boolean
  error?: boolean
  children?: React.ReactNode
  wrapClassName?: string
  onChange?: (value: string) => void;
  inputValue?: string
  isFormChild?: boolean
  showCaret?: boolean
  ref?: Ref<InputRefType>
} & ({
  showCount: true;
  onCountCheck: (passed: boolean) => void
} | { showCount?: false; onCountCheck?: undefined })

const TEM_SPAN_ID = 'input_mirror'

const Input = (props: Props) => {
  const {
    checkedPass,
    error,
    children,
    wrapClassName,
    showCount,
    inputValue,
    isFormChild,
    onCountCheck,
    showCaret = true,
    ref: componentRef,
    ...rest
  } = props;
  const [value, setValue] = useState<string | undefined>();
  const [passValidate, setPassValidate] = useState<boolean | undefined>(undefined);
  const { inputRef, caretRef, setCursorPos } = setInputCursorPos(TEM_SPAN_ID);

  const checkCount = (value: string) => {
    const pass = !(value.length < (rest.minLength || 0)) && !(value.length > (rest.maxLength || 0));
    setPassValidate(pass)
    onCountCheck?.(pass)
  }

  useEffect(() => {
    setValue(inputValue)
  }, [inputValue]);

  useImperativeHandle(props.ref, () => {
    return {
      setInputValue: (value) => {
        setValue(value)
        if (showCount) {
          checkCount(value || '')
        }
      }
    }
  })

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    setCursorPos(e)

    const newValue = e.target.value
    if (showCount) {
      const showValue = newValue.trim()
      checkCount(showValue)
    }
    rest.onChange?.(e.target.value)
  }

  return <div
    className={cx(
      S.wrap,
      props.error && S.err,
      props.checkedPass ? S.checkedPass : '',
      showCount && passValidate !== undefined && (passValidate ? S.lengthSuccess : S.err),
      isFormChild && S.formInput,
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
      className={cx(S.caret, showCaret ? 'visible' : 'invisible')}
      style={{
        // '--left-deviation': `${hiddenSpanWidth}px`,
      }}
    />
  </div>
}

export default Input;