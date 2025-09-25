import { useRef, useState } from "react";
import PINPassword from "../EnterPassword/PINPassword";
import Scan from "./Scan";
import useUserInfoStore from "@/store/userInfo";

const ScanImport = (props: {
  jumpToMain: () => void
}) => {
  const fileContentRef = useRef('')

  const [step, setStep] = useState<'scan' | 'password'>('scan')

  const getDidInfo = async (info: string) => {
    await useUserInfoStore.getState().importUserDid(JSON.parse(info))
    props.jumpToMain()
  }

  if (step === 'password') {
    return <PINPassword
      fileText={fileContentRef.current}
      getDidInfo={getDidInfo}
      cancel={() => {
        setStep('scan')
        fileContentRef.current = ''
      }}
    />
  }

  return <Scan
    getScanData={(code) => {
      fileContentRef.current = code;
      setStep('password')
    }}
  />
}

export default ScanImport;