'use client'

import S from './index.module.scss'
import { JSX, useEffect, useRef, useState } from "react";
import SuccessIcon from '@/assets/login/success.svg';
import cx from "classnames";

type Props = Omit<JSX.IntrinsicElements['input'], 'onChange'> & {
  checkedPass?: boolean
  error?: boolean
  children?: React.ReactNode
  wrapClassName?: string
  showCount?: boolean
  onChange?: (value: string) => void;
}

const TEM_SPAN_ID = 'input_mirror'

const Input = (props: Props) => {
  const {
    checkedPass,
    error,
    children,
    wrapClassName,
    showCount,
    ...rest
  } = props;
  const [value, setValue] = useState<string | undefined>();
  const [passValidate, setPassValidate] = useState<boolean | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  const getCursorPosition = (e) => {
    const {selectionStart = 0, selectionEnd = 0} = e.target;
    if (selectionStart === selectionEnd) {

      const input = inputRef.current;

      // 创建临时span来计算光标位置
      const tempSpan = document.getElementById(TEM_SPAN_ID);
      if (!tempSpan) return

      tempSpan.style.cssText = `
        position: absolute;
        visibility: hidden;
        white-space: pre;
        font-family: ${getComputedStyle(input).fontFamily};
        font-size: ${getComputedStyle(input).fontSize};
      `;

      // 获取光标前的文本
      const textBeforeCursor = input.value.substring(0, selectionStart);
      tempSpan.textContent = textBeforeCursor;

      const cursorLeft = tempSpan.offsetWidth;
      const paddingLeftValue = parseFloat(input.offsetLeft);

      const left = paddingLeftValue + cursorLeft - input.scrollLeft

      caretRef.current.style.left = left + 'px'

      // setHiddenSpanWidth(left);
    }
  }

  useEffect(() => {
    const tempSpan = document.createElement('span');
    tempSpan.id = TEM_SPAN_ID
    document.body.appendChild(tempSpan);

    return () => {

      const tempSpan = document.getElementById(TEM_SPAN_ID);
      if (!tempSpan) return
      document.body.removeChild(tempSpan);
    }
  }, []);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    getCursorPosition(e)

    const newValue = e.target.value
    if (showCount) {
      const pass = !(newValue.length < (rest.minLength || 0)) && !(newValue.length > (rest.maxLength || 0));
      setPassValidate(pass)
      if (!pass) {
        rest.onChange?.('')
        return
      }
    }
    rest.onChange?.(e.target.value)
  }

  return <div
    className={cx(
      S.wrap,
      props.error && S.err,
      props.checkedPass ? S.checkedPass : '',
      showCount && passValidate !== undefined && (passValidate ? S.lengthSuccess : S.err),
      wrapClassName,
    )}
  >
    <input
      {...rest}
      ref={inputRef}
      type="text"
      name="username"
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck="false"
      inputMode="text"
      onKeyDownCapture={getCursorPosition}
      onKeyUpCapture={getCursorPosition}
      onClick={getCursorPosition}
      onChange={inputChange}
      className={rest.className}
    />
    {props.checkedPass && <span className={S.icon}>
      <SuccessIcon className={S.icon} />
    </span>}

    {showCount && value !== undefined && <span
      className={S.lengthLimit}
    >{value?.length || 0}/{rest.maxLength}</span>}

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