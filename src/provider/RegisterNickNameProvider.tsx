import React, { createContext, useMemo, useState } from "react";
import { APP_CONTEXT } from "@/provider/WalletProvider";
import { USER_DOMAIN } from "@/constant/Network";

export type ValidateResult = {
  valid: boolean;
  error?: string;
  repeatPass?: boolean
};

type RegisterNickNameProviderProps = {
  nickname?: string
  userHandle?: string
  setNickName: (nickname: string) => void
  isInputFocus?: boolean
  setIsInputFocus: (is: boolean) => void

  showBlinkAnimate?: boolean
  validate?: ValidateResult
  setValidate: (v?: ValidateResult) => void
  resetContext: () => void
}

const SetNickNameContext = createContext<RegisterNickNameProviderProps>({
  nickname: undefined,
  setNickName: nickname => {},
  isInputFocus: undefined,
  setIsInputFocus: is => {},
  setValidate: (v?: ValidateResult) => {},
  resetContext: () => {}
});

export const SetNickNameProvider = (props: {
  children: React.ReactNode;
}) => {
  const [nickname, setNickName] = useState('')
  const [isInputFocus, setIsInputFocus] = useState(false)
  const [validate, setValidate] = useState<ValidateResult>()

  const showBlinkAnimate = useMemo(() => {
    return !nickname && !isInputFocus
  }, [nickname, isInputFocus])

  const userHandle = nickname + `.${USER_DOMAIN}`

  const reset = () => {
    setNickName('')
    setIsInputFocus(false)
    setValidate(undefined)
  }

  return <SetNickNameContext.Provider
    value={{
      nickname,
      userHandle,

      setNickName,
      isInputFocus,
      setIsInputFocus,

      showBlinkAnimate,
      validate,
      setValidate,
      resetContext: reset
    }}
  >
    {props.children}
  </SetNickNameContext.Provider>
}

export function useNickName() {
  const context = React.useContext(SetNickNameContext);

  return context;
}