import S from './index.module.scss'
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useState } from "react";
import { decryptData } from "@/lib/encrypt";

const EnterPassword = (props: {
  fileText: string
  getDidInfo: (info: string) => void
  cancel: () => void
}) => {
  const { fileText } = props;
  const [validateStatus, setValidateStatus] = useState<boolean | undefined>(undefined)
  const [error, setError] = useState(false)
  const [password, setPassword] = useState('')

  const parsingText = async () => {
    const result = await decryptData(fileText, password);
    if (result === 'error') {
      setError(true)
      setPassword('')
      return
    }
    props.getDidInfo(result)
  }

  return <div className={S.password}>
    <p className={S.title}>请输入解锁密码，即可立刻上传</p>
    <div className={'relative'}>
      <Input
        inputValue={password}
        error={validateStatus === false || error}
        wrapClassName={S.inputWrap}
        placeholder={'支持由数字或字母组成的8位数密码'}
        onChange={value => {
          const flag = /^[A-Za-z0-9]{8}$/.test(value)
          setPassword(value)
          setError(false)
          setValidateStatus(flag)
        }}
      />
      {(validateStatus === false || error) && <p className={S.error}>
        <img
          src={'/assets/warning.svg'}
          alt={'warning'}
        />
        {error ? '密码错误，请重新输入' : '请输入由数字或字母组成的8位数密码'}
      </p>}
    </div>

    <div className={S.footer}>
      <Button
        type={'primary'}
        className={S.button}
        disabled={!validateStatus || error}
        onClick={parsingText}
      >确认</Button>
      <Button
        className={S.button}
        onClick={props.cancel}
      >取消</Button>
    </div>
  </div>
}

export default EnterPassword;