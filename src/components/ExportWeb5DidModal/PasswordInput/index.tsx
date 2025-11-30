import S from './index.module.scss'
import { useMemo, useState } from "react";
import { useBoolean } from "ahooks";
import Input from "@/components/Input";
import cx from "classnames";
import Image from "next/image";
import remResponsive from "@/lib/rem-responsive";

const regex = /^[A-Za-z0-9]{8}$/;

const PasswordInput = ({ valueChange, statusChange, errMes }: {
  valueChange: (v: string) => void
  statusChange?: (status: boolean) => void
  errMes?: string
}) => {
  const [validateStatus, setValidateStatus] = useState<boolean | undefined>(undefined)
  const [showClearText, setShowClearText] = useBoolean(false)

  const error = useMemo(() => {
    if (validateStatus === false) {
      return '请输入由数字或字母组成的8位数密码'
    }
    return errMes
  }, [validateStatus, errMes])

  return <div className={'relative'} style={{ marginBottom: remResponsive(15) }}>
    <Input
      showCaret={showClearText}
      type={showClearText ? 'text' : 'password'}
      error={validateStatus === false}
      wrapClassName={cx(S.wrap, !showClearText && S.showOriginCaret)}
      placeholder={'支持由数字或字母组成的8位数密码'}
      onChange={value => {
        const flag = regex.test(value)
        valueChange(value)
        setValidateStatus(flag)
        statusChange?.(flag)
      }}
    >
      <div onClick={setShowClearText.toggle} className={'cursor-pointer'}>
        <Image
          alt={''}
          src={!showClearText ? require('@/assets/eye-closed.png') : require('@/assets/eye-open.png')}
          style={{ width: remResponsive(10) }}
        />
      </div>
    </Input>
    {error && <p className={S.error}>
      <img
        src={'/assets/warning.svg'}
        alt={'warning'}
      />
      {error}</p>}
  </div>
}

export default PasswordInput;