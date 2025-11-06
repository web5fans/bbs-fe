import { useBoolean } from "ahooks";
import DonateModal, { AuthorType } from "./DonateModal";
import S from './index.module.scss'
import DonateIcon from '@/assets/posts/donate.svg'
import { useEffect, useRef, useState } from "react";
import cx from "classnames";
import numeral from "numeral";
import useCurrentUser from "@/hooks/useCurrentUser";

const Donate = (props: {
  showList: () => void
  author: AuthorType
  uri: string
  nsid?: 'app.bbs.post' | 'app.bbs.comment'
}) => {
  const { nsid = 'app.bbs.comment' } = props;
  const [visible, { toggle }] = useBoolean(false)
  const { hasLoggedIn } = useCurrentUser()

  return <div className={S.wrap}>
    <ShowDonate showList={props.showList} />
    {hasLoggedIn && <span
      onClick={toggle}
      className={S.text}
    >打赏此贴</span>}

    <DonateModal
      visible={visible}
      onClose={toggle}
      author={props.author}
      uri={props.uri}
      nsid={nsid}
    />
  </div>
}

export default Donate;

function ShowDonate(props: {
  showList: () => void
}) {
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

    <div
      className={cx(S.showDonate, isAnimating && S.animating)}
      onClick={() => {
        if (!isAnimating) {
          props.showList()
        }
      }}
    >
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