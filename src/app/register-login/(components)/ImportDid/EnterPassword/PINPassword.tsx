import { useState } from "react";
import S from "./index.module.scss";
import PINCodeInput from "@/app/user-center/_components/KeyQRCodeModal/PINCodeInput";
import Button from "@/components/Button";
import { decryptData } from "@/lib/encrypt";

const PINPassword = (props: {
  fileText: string
}) => {
  const { fileText } = props;
  const [disabled, setDisabled] = useState(true)

  const parsingText = async () => {
    const result = await decryptData(fileText, 'password');
    if (result === 'error') {

      return
    }
    // props.getDidInfo(result)
  }

  return <div className={S.password}>
    <p className={S.title}>请输入你设置Pin码</p>
    <div className={'relative'}>
      <PINCodeInput codeChange={value => {
        // props.inputChange(value)
        setDisabled(value.length !== 4)
      }} />
    </div>
    <div className={S.footer}>
      <Button
        type={'primary'}
        className={S.button}
        disabled={disabled}
        onClick={parsingText}
      >确认</Button>
      <Button className={S.button}>取消</Button>
    </div>
  </div>
}

export default PINPassword;