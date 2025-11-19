import S from './index.module.scss'
import Modal from "@/components/Modal";
import CardWindow from "@/components/CardWindow";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { cloneElement, JSX, useEffect, useRef, useState } from "react";
import { decryptData, encryptData } from "@/lib/encrypt";
import storage from "@/lib/storage";
import { useBoolean } from "ahooks";
import { useToast } from "@/provider/toast";

const regex = /^[A-Za-z0-9]{8}$/;

const ExportWeb5DidModal = (props: {
  children: JSX.Element;
}) => {
  const [visible, { setTrue, setFalse, toggle }] = useBoolean(false)

  const test = async () => {
    const text = '6K2CkMsbgpTJYz0WQNv2IUSGPJlIDnpxWoLCEIk1HQ15tNGJWSnvzcNnIN1M5i2C1ZOVYVWfc3oc9a7MKRZCvhWpwltR2paKLC2wLDkitrQ7JPQiLjyqO4eZCG3sccqNYVtc1+9N/svuP9pILwZCRr5c8X6tAntAGkfNuecMXArInmkaJY4I5oPoTpZUxF/RzOnDIFZGacuVgOTdcaXr9BOlRKVtIYlHoNhEwe1zAolRGwn1cTPnnniNtjLmJJ6hsuuwc2JGnfHxIjP8vcJEBZA1ddKbdqPZMLVrr/HtU2ZAOnwJ2zTd04X8AzzH34+EbcpXOFbNoQDR24tPGiYIF3dImkal4cl0uSaAA42Wl3p5lduIgmsjH69bU7sR5GEJtd0A09c=';

    const result = await decryptData(text, '12345678');
    console.log('result', result);
  }

  return <>
  {cloneElement(props.children, {
    onClick: toggle
  })}
    <Modal visible={visible} onlyMask>
      <ExportWebDidWindow onClose={setFalse} onCancel={setFalse} />
    </Modal>
  </>
}

export default ExportWeb5DidModal;



export function ExportWebDidWindow(props: {
  onClose?: () => void;
  headerTitle?: string
  onCancel: () => void
  wrapClassName?: string
  headerTitleClassName?: string
}) {
  const [curStep, setCurStep] = useState<'password' | 'export'>('password')
  const passwordRef = useRef('')

  const close = () => {
    passwordRef.current = ''
    setCurStep('password')
  }

  const cancel = () => {
    close()
    props.onCancel?.()
  }

  return <CardWindow
    wrapClassName={`${S.window} ${props.wrapClassName}`}
    header={props.headerTitle || 'Web5 DID信息'}
    showCloseButton
    headerClassName={`${S.header} ${props.headerTitleClassName}`}
    onClose={() => {
      close();
      props.onClose?.()
    }}
  >
    {curStep === 'password' && (
      <StepPassWord
        inputChange={value => passwordRef.current = value}
        stepChange={() => setCurStep('export')}
        cancel={cancel}
      />
    )}
    {curStep === 'export' && (
      <StepExport
        password={passwordRef.current}
        cancel={cancel}
      />
    )}
  </CardWindow>
}



function StepPassWord(props: {
  inputChange: (value: string) => void
  stepChange: () => void
  cancel: () => void
}) {
  const [validateStatus, setValidateStatus] = useState<boolean | undefined>(undefined)

  return <div className={S.container}>
    <p className={S.title}>为保障安全</p>
    <p className={S.title}>导出前请设置你的密码</p>
    <p className={S.message}>此密码在导入web5 DID信息登录时使用，请妥善保存</p>
    <div className={'relative'}>
      <Input
        error={validateStatus === false}
        wrapClassName={S.inputWrap}
        placeholder={'支持由数字或字母组成的8位数密码'}
        onChange={value => {
          const flag = regex.test(value)
          props.inputChange(value)
          setValidateStatus(flag)
        }}
      />
      {validateStatus === false && <p className={S.error}>
        <img
          src={'/assets/warning.svg'}
          alt={'warning'}
        />
        请输入由数字或字母组成的8位数密码</p>}
    </div>

    <div className={S.footer}>
      <Button
        type={'primary'}
        className={S.button}
        disabled={!validateStatus}
        onClick={() => props.stepChange()}
      >确认</Button>
      <Button className={S.button} onClick={props.cancel}>取消</Button>
    </div>
  </div>
}

function StepExport({ password, cancel }: {
  password: string
  cancel: () => void
}) {
  const [exporting, setExporting] = useState(false)
  const toast = useToast()

  const exportTextFile = async () => {
    setExporting(true)
    const storageInfo = storage.getToken()

    const content = await encryptData(JSON.stringify(storageInfo), password)
    if (!content) {
      setExporting(false)
      return
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'Web5DID信息.txt';
    document.body.appendChild(link);
    link.click();
    setExporting(false)
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    cancel()
    toast({ title: '导出成功', icon: 'success' })
  }

  return <div className={S.exportContainer}>
    <div className={S.content}>
      <img
        src={'/assets/export-computer.png'}
        alt={'computer'}
      />
      <div>
        <p className={S.title}>Web5 DID等登录密钥信息</p>
        <p className={S.info}>
          导出保存文件即可未来在多设备登录或
          穿梭其他web5技术网站使用。请妥善保存，若密钥泄漏，账号有被盗风险!
        </p>
      </div>
    </div>
    <div className={S.footer}>
      {exporting ? <Button
        type={'primary'}
        className={S.confirm}
        disabled
      >导出中...</Button> : <Button
        type={'primary'}
        className={S.confirm}
        onClick={exportTextFile}
      >导出文件</Button>}
      <Button className={S.button} onClick={cancel}>取消</Button>
    </div>
  </div>
}