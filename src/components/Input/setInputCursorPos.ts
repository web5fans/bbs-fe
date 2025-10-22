import { useEffect, useRef } from "react";

export default function setInputCursorPos(id?: string) {
  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  const TEM_SPAN_ID = id || 'tem_span'

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
      caretRef.current.style.display = 'block'

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

  return {
    inputRef,
    caretRef,
    setCursorPos: getCursorPosition
  }
}