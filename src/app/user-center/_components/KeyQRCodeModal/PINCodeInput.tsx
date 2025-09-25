import S from './index.module.scss'
import { Ref, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

type Digit = "" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

const BOX_COUNT = 4;

export type PinCodeInputRefProps = {
  clear: () => void
}

const PINCodeInput = (props: {
  codeChange: (value:string) => void,
  inputClassName?: string;
  ref?: Ref<PinCodeInputRefProps>
}) => {
  const [digits, setDigits] = useState<Digit[]>(Array.from({ length: BOX_COUNT }, () => ""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array.from({ length: BOX_COUNT }, () => null));

  useEffect(() => {
    props.codeChange(digits.join(""))
  }, [digits]);

  useImperativeHandle(props.ref, () => {
    return {
      clear: () => {
        setDigits(Array.from({ length: BOX_COUNT }, () => ""));
      }
    }
  })

  const focusIndex = useCallback((index: number) => {
    const el = inputRefs.current[index];
    if (el) {
      el.focus();
      el.select();
    }
  }, []);

  const updateDigit = useCallback((index: number, value: string) => {
    const numeric = value.replace(/\D/g, "");
    setDigits(prev => {
      const next = [...prev] as Digit[];
      next[index] = (numeric[0] ?? "") as Digit;
      return next;
    });
  }, []);

  const handleChange = useCallback((index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateDigit(index, val);
    if (/^\d$/.test(val)) {
      const nextIndex = Math.min(index + 1, BOX_COUNT - 1);
      focusIndex(nextIndex);
    }
  }, [focusIndex, updateDigit]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        // Clear current and stay if not empty
        setDigits(prev => {
          const next = [...prev] as Digit[];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        // Move to previous
        focusIndex(index - 1);
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      focusIndex(index - 1);
    }
    if (e.key === "ArrowRight" && index < BOX_COUNT - 1) {
      focusIndex(index + 1);
    }
  }, [digits, focusIndex]);

  const handlePaste = useCallback((index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, BOX_COUNT);
    if (!pasted) return;
    setDigits(prev => {
      const next = [...prev] as Digit[];
      for (let i = 0; i < BOX_COUNT - index; i += 1) {
        next[index + i] = (pasted[i] ?? next[index + i] ?? "") as Digit;
      }
      return next;
    });
    const finalIndex = Math.min(index + pasted.length, BOX_COUNT - 1);
    focusIndex(finalIndex);
  }, [focusIndex]);

  return <div className={S.pinInputWrap}>
    {digits.map((d, i) => (
      <input
        key={i}
        ref={el => (inputRefs.current[i] = el)}
        value={d}
        className={`${d ? S.active : ''} ${props.inputClassName}`}
        inputMode="numeric"
        pattern="\\d*"
        maxLength={1}
        placeholder=""
        onChange={e => handleChange(i, e)}
        onKeyDown={e => handleKeyDown(i, e)}
        onPaste={e => handlePaste(i, e)}
      />
    ))}
  </div>
}

export default PINCodeInput;