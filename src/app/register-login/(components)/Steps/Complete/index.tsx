import { CompleteLeft } from "./left";
import { CompleteRight } from "./right";
import BreadCrumbs from "@/app/register-login/(components)/BreadCrumbs";
import S from './index.module.scss';

const CompleteStep = () => {
  return <div className={S.wrap}>
    <div className={S.left}>
      <BreadCrumbs activeStep={3} />
      <CompleteLeft />
    </div>
    <CompleteRight />
  </div>
}

export default CompleteStep;