import Modal from "@/components/Modal";
import S from "./index.module.scss";
import CardWindow from "@/components/CardWindow";
import PINCodeInput from "./PINCodeInput";
import Button from "@/components/Button";
import QRCodeStep from "@/app/user-center/_components/KeyQRCodeModal/QRCodeStep";
import { useBoolean } from "ahooks";
import { cloneElement, useRef, useState } from "react";

const KeyQRCodeModal = (props: {
  children: React.ReactNode;
}) => {
  const [visible, { setTrue, setFalse, toggle }] = useBoolean(false)
  const [curStep, setCurStep] = useState<'password' | 'qrcode'>('password')
  const passwordRef = useRef('')

  const close = () => {
    passwordRef.current = ''
    setCurStep('password')
    setFalse()
  }

  return <>
    {cloneElement(props.children, {
      onClick: toggle
    })}
    <Modal visible={visible} onlyMask>
      <CardWindow
        wrapClassName={S.window}
        header={'Web5 DID信息'}
        showCloseButton
        headerClassName={S.header}
        onClose={close}
      >
        {curStep === 'password' && <PINCodeStep
          inputChange={value => passwordRef.current = value}
          stepChange={() => setCurStep('qrcode')}
          cancel={close}
        />}
        {curStep === 'qrcode' && <QRCodeStep pinCode={passwordRef.current} />}
      </CardWindow>
    </Modal>
  </>
}

export default KeyQRCodeModal;

function PINCodeStep(props: {
  inputChange: (value: string) => void
  stepChange: () => void
  cancel: () => void
}) {
  const [disabled, setDisabled] = useState(true)

  return <div className={S.pinContainer}>
    <p className={S.title}>为保障安全<br />查看二维码之前，请设置4位数密码</p>
    <p className={S.info}>此密码为一次性临时Pin码，仅在登录时二次验证使用</p>
    <PINCodeInput codeChange={value => {
      props.inputChange(value)
      setDisabled(value.length !== 4)
    }} />
    <div className={S.footer}>
      <Button
        type={'primary'}
        className={S.button}
        disabled={disabled}
        onClick={() => props.stepChange()}
      >确认</Button>
      <Button className={S.button} onClick={props.cancel}>取消</Button>
    </div>
  </div>
}