import { useBoolean } from "ahooks";
import DonateModal, { AuthorType } from "./DonateModal";
import S from './index.module.scss'
import DonateIcon from '@/assets/posts/donate.svg'
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import cx from "classnames";
import numeral from "numeral";
import useCurrentUser from "@/hooks/useCurrentUser";

const Donate = (props: {
  showList: () => void
  author: AuthorType
  uri: string
  nsid?: 'app.bbs.post' | 'app.bbs.comment'
  count: string
}) => {
  const { nsid = 'app.bbs.comment' } = props;
  const [visible, { toggle, setFalse }] = useBoolean(false)
  const { hasLoggedIn } = useCurrentUser()

  const [donate, setDonate] = useState(0)

  const ref = useRef<ShowDonateRefType>(null)

  useEffect(() => {
    setDonate(Number(props.count))
  }, [props.count]);

  const num = (donate / Math.pow(10, 8)).toFixed(2)

  return <div className={S.wrap}>
    <ShowDonate showList={props.showList} donate={num} ref={ref} />
    <span
      onClick={toggle}
      className={S.text}
    >打赏此贴</span>

    <DonateModal
      visible={visible}
      onClose={toggle}
      author={props.author}
      uri={props.uri}
      nsid={nsid}
      onConfirm={(ckbAmount) => {
        setDonate(v => v + Number(ckbAmount))
        ref.current?.showAnimate()
        setFalse()
      }}
    />
  </div>
}

export default Donate

type ShowDonateRefType = {
  showAnimate: () => void
}

function ShowDonate(props: {
  showList: () => void
  donate: number | string
  ref?: React.Ref<ShowDonateRefType>
}) {
  const { donate } = props;
  const [isAnimating, setIsAnimating] = useState(false)

  useImperativeHandle(props.ref, () => {
    return {
      showAnimate: () => {
        setIsAnimating(true)
        setTimeout(() => {
          setIsAnimating(false)
        }, 3000)
      }
    }
  })

  return  <div
      className={cx(S.showDonate, isAnimating && S.animating)}
      onClick={() => {
        if (!isAnimating) {
          props.showList()
        }
      }}
    >
      <DonateIcon className={S.icon} />
      {isAnimating ? <PasswordLock value={donate} /> : donate}
      &nbsp;CKB
    </div>
}

function PasswordLock({ value }: { value: string | number }) {
  const digits = value.toString().split('').map(Number);

  return (
    <div className={S.passwordLock}>
      {digits.map((digit, index) => {
        if (Number.isNaN(digit)) return '.'
        return <PasswordLockNumber key={index} digit={digit} duration={1200 + index * 80} />
      })}
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