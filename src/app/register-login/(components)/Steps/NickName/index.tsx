import { StepNickNameLeft } from './left'
import { StepNickNameRight } from './right'
import S from './index.module.scss'
import BreadCrumbs from "@/app/register-login/(components)/BreadCrumbs";

const NickNameStep = (props: {
  goNext: () => void,
  goPrevious: () => void,
}) => {
  return <div className={S.wrap}>
    <div className={S.top}>
      <BreadCrumbs activeStep={1} />
      <StepNickNameLeft goNext={props.goNext} goPrev={props.goPrevious} />
    </div>
    <div className={S.bottom}>
      <StepNickNameRight />
    </div>
  </div>
}

export default NickNameStep;