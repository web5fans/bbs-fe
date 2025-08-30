import S from './index.module.scss';
import UserNameIcon from '@/assets/login/bread/name.svg'
import IdentityIcon from '@/assets/login/bread/identity.svg'
import DoneIcon from '@/assets/login/bread/done.svg'
import ArrowRightIcon from '@/assets/login/bread/arrow.svg'
import cx from "classnames";

export enum CREATE_ACCOUNT_STEP {
  INTRO,
  NICKNAME,
  ON_CHAIN,
  DONE
}

const steps = [{
  name: '设置名称',
  icon: <UserNameIcon className={S.icon} />,
  value: CREATE_ACCOUNT_STEP.NICKNAME
},{
  name: '上链存储',
  icon: <IdentityIcon className={S.icon} />,
  value: CREATE_ACCOUNT_STEP.ON_CHAIN
},{
  name: '完成',
  icon: <DoneIcon className={S.icon} />,
  value: CREATE_ACCOUNT_STEP.DONE
}]

const BreadCrumbs = (props: {
  activeStep?: CREATE_ACCOUNT_STEP
}) => {
  const { activeStep = CREATE_ACCOUNT_STEP.NICKNAME } = props;

  return <div className={S.wrap}>
    {steps.map((step, index) => {
      return <div key={index} className={S.breadWrap}>
        <div className={cx(S.bread, activeStep === step.value && S.active)}>
          {step.icon}
          {step.name}
        </div>
        {index !== steps.length - 1 && (
          <ArrowRightIcon className={S.arrow} />
        )}
      </div>
    })}

  </div>
}

export default BreadCrumbs;