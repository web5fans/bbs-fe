'use client'

import SmileAnimate from "../../../SmileAnimate";
import Computer from "../../../Computer";
import ComputerCard from "../../../ComputerCard";
import { useNickName } from "@/provider/RegisterNickNameProvider";
import S from './index.module.scss'
import cx from "classnames";
import { useEffect, useRef } from "react";


export const StepNickNameRight = () => {
  const { showBlinkAnimate, validate, nickname } = useNickName()
  const ref = useRef<HTMLDivElement | null>(null);
  const flyRef = useRef<HTMLDivElement | null>(null);

  const disabled = !(validate?.valid && validate?.repeatPass)

  useEffect(() => {
    if (!ref.current || !flyRef.current) return;
    const left = ref.current.offsetLeft + ref.current.clientWidth
    flyRef.current.style.left = left + 'px';

  }, []);

  return <div className={S.wrap} ref={ref}>
    {showBlinkAnimate
      ? <SmileAnimate />
      : <Computer>
        <ComputerCard name={nickname} disabled={disabled} />
      </Computer>
    }

    <div className={cx(S.flyCard, showBlinkAnimate && '!hidden')} ref={flyRef}>
      <ComputerCard name={nickname} disabled={disabled} />
    </div>
  </div>
}