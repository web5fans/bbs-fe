import SmileAnimate from "../../../SmileAnimate";
import Computer from "../../../Computer";
import ComputerCard from "../../../ComputerCard";
import { useNickName } from "@/provider/RegisterNickNameProvider";
import S from './index.module.scss'
import cx from "classnames";


export const StepNickNameRight = () => {
  const { showBlinkAnimate, validate, nickname } = useNickName()

  const disabled = !(validate?.valid && validate?.repeatPass)

  return <div className={S.wrap}>
    {showBlinkAnimate
      ? <SmileAnimate />
      : <Computer>
        <ComputerCard name={nickname} disabled={disabled} />
      </Computer>
    }

    <div className={cx(S.flyCard, showBlinkAnimate && '!hidden')}>
      <ComputerCard name={nickname} disabled={disabled} />
    </div>
  </div>
}