'use client'

import S from './index.module.scss'
import { JSX, useEffect, useRef, useState } from "react";
import cx from "classnames";

type Props = Omit<JSX.IntrinsicElements['textarea'], 'onChange' | 'value'> & {
  error?: boolean
  children?: React.ReactNode
  wrapClassName?: string
  onChange?: (value: string) => void;
  inputValue?: string
}

const TEM_SPAN_ID = 'textarea_mirror'

const TextArea = (props: Props) => {
  const {
    error,
    children,
    wrapClassName,
    inputValue,
    ...rest
  } = props;
  const [value, setValue] = useState<string | undefined>();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setValue(inputValue)
  }, [inputValue]);

  const getCursorPosition = (e: any) => {
    const {selectionStart = 0, selectionEnd = 0} = e.target;
    if (selectionStart === selectionEnd) {

      const input = textAreaRef.current;

      if (!input) return

      // 创建临时span来计算光标位置
      const tempSpan = document.getElementById(TEM_SPAN_ID);
      if (!tempSpan) return
      const styles = getComputedStyle(input);

      input.style.height = input.scrollHeight + 'px'

      tempSpan.style.cssText = `
        position: absolute;
        display: inline-block;
        visibility: hidden;
        white-space: pre-wrap;
        word-break: break-word;
        font-family: ${styles.fontFamily};
        font-size: ${styles.fontSize};
        line-height: ${styles.lineHeight};
        max-width: ${styles.width};
        min-height: ${styles.lineHeight};
      `;

      // 获取光标前的文本
      let textBeforeCursor = input.value.substring(0, selectionStart);
      // 处理空行情况：如果当前行是空行，添加一个零宽空格
      const lines = textBeforeCursor.split('\n');
      if (lines[lines.length - 1] === '') {
        textBeforeCursor += '\u200B'; // 零宽空格
      }
      tempSpan.textContent = textBeforeCursor;

      const range = document.createRange();
      if (tempSpan.firstChild) {
        // 选择文本的最后一个字符
        range.setStart(tempSpan.firstChild, textBeforeCursor.length);
        range.setEnd(tempSpan.firstChild, textBeforeCursor.length);
      }

      // 获取最后一个字符的位置信息
      const rect = range.getBoundingClientRect();

      const paddingLeft = input.offsetLeft;
      const paddingTop = input.offsetTop;

      const top = tempSpan.offsetHeight;

      // 计算相对于span左侧的距离
      const distanceFromLeft = rect.right + Number(paddingLeft);
      const disTop = top + Number(paddingTop);

      if (caretRef.current) {
        caretRef.current.style.left = distanceFromLeft + 'px'
        caretRef.current.style.top = disTop + 'px'
        caretRef.current.style.display = 'block'
      }
      // setHiddenSpanWidth(left);
    }
  }

  useEffect(() => {
    const tempSpan = document.createElement('div');
    tempSpan.id = TEM_SPAN_ID
    document.body.appendChild(tempSpan);

    return () => {

      const tempSpan = document.getElementById(TEM_SPAN_ID);
      if (!tempSpan) return
      document.body.removeChild(tempSpan);
    }
  }, []);

  const inputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    getCursorPosition(e)
    rest.onChange?.(e.target.value.trim())
  }

  return <div
    className={cx(
      S.wrap,
      props.error && S.err,
      wrapClassName,
    )}
  >
    <textarea
      ref={textAreaRef}
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck="false"
      {...rest}
      onKeyDownCapture={getCursorPosition}
      onKeyUpCapture={getCursorPosition}
      onClick={getCursorPosition}
      onChange={inputChange}
      className={rest.className}
      onBlur={() => {
        if (caretRef.current) {
          caretRef.current.style.removeProperty('display');
        }
      }}
      value={value || ''}
    />

    <span
      ref={caretRef}
      className={S.caret}
      style={{
        // '--left-deviation': `${hiddenSpanWidth}px`,
      }}
    />
  </div>
}

export default TextArea;