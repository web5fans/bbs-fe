import { useRef, useState } from "react";
import S from "./index.module.scss";
import PINCodeInput, { PinCodeInputRefProps } from "@/app/user-center/_components/KeyQRCodeModal/PINCodeInput";
import Button from "@/components/Button";
import { decryptData } from "@/lib/encrypt";

const PINPassword = (props: {
  fileText: string
  getDidInfo: (info: string) => void
  cancel: () => void
}) => {
  const { fileText } = props;
  const [disabled, setDisabled] = useState(true)

  const [pinCode, setPinCode] = useState<string | undefined>()

  const [error, setError] = useState(false)

  const inputRef = useRef<PinCodeInputRefProps>({})

  const parsingText = async () => {
    const result = await decryptData(fileText, pinCode);
    if (result === 'error') {
      inputRef.current.clear()
      setError(true)
      return
    }
    props.getDidInfo(result)
  }

  return <div className={S.password}>
    <p className={S.title}>请输入你设置Pin码</p>
    <div className={'relative'}>
      <PINCodeInput
        inputClassName={error ? S.errorInput : ''}
        ref={inputRef}
        codeChange={value => {
          if (value) setError(false)
          setPinCode(value)
          setDisabled(value.length !== 4)
        }}
      />
      {error && <p className={S.error}>
        <img
          src={'/assets/warning.svg'}
          alt={'warning'}
        />
        密码错误，请重新输入
      </p>}
    </div>
    <div className={S.footer}>
      <Button
        type={'primary'}
        className={S.button}
        disabled={disabled}
        onClick={parsingText}
      >确认</Button>
      <Button className={S.button} onClick={props.cancel}>取消</Button>
    </div>
  </div>
}

export default PINPassword;