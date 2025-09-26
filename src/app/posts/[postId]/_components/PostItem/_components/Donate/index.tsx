import { useBoolean } from "ahooks";
import DonateModal from "./DonateModal";
import S from './index.module.scss'
import DonateIcon from '@/assets/posts/donate.svg'
import { useEffect, useRef, useState } from "react";
import cx from "classnames";
import numeral from "numeral";

const Donate = () => {
  const [visible, { toggle }] = useBoolean(false)
  return <div className={S.wrap}>
    <ShowDonate />
    <span onClick={toggle} className={S.text}>打赏此贴</span>

    <DonateModal visible={visible} />
  </div>
}

export default Donate;

function ShowDonate() {
  const [donate, setDonate] = useState(237)

  const [isAnimating, setIsAnimating] = useState(false)

  const mockUpdate = () => {
    setIsAnimating(true)
    setDonate(v => v + 32)
    setTimeout(() => {
      setIsAnimating(false)
    }, 3000)
  }

  const num = donate.toString().length > 3 ? numeral(donate).format('0.0a') : donate

  return <>
    {/*<span onClick={mockUpdate}>update</span>*/}

    <div className={cx(S.showDonate, isAnimating && S.animating)}>
      <DonateIcon className={S.icon} />
      {isAnimating ? <PasswordLock value={donate} /> : num}
      &nbsp;CKB
    </div>
  </>
}

function PasswordLock({ value }: { value: string | number }) {
  const digits = value.toString().split('').map(Number);

  return (
    <div className={S.passwordLock}>
      {digits.map((digit, index) => (
        <PasswordLockNumber key={index} digit={digit} duration={1200 + index * 80} />
      ))}
    </div>
  );
};

const PasswordLockNumber = ({ digit, duration = 3000 }) => {
  const [currentDigit, setCurrentDigit] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (digit !== currentDigit) {
      setCurrentDigit(digit);
    }
  }, [digit, currentDigit, duration]);

  // 生成数字列表用于滚动效果
  const numbers = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div ref={containerRef} className={S.passwordLockDigit}>
      <div
        className={`${S.digitContainer}`}
        style={{
          transform: `translateY(-${currentDigit * 10}%)`,
          transition: `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
        }}
      >
        {numbers.map((num) => (
          <span key={num}>
            {num}
          </span>
        ))}
      </div>
    </div>
  );
};