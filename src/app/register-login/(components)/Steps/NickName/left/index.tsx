'use client'

import Input from "@/components/Input";
import { useNickName, ValidateResult } from "@/provider/RegisterNickNameProvider";
import S from './index.module.scss'
import cx from "classnames";
import Button from "@/components/Button";
import { useWallet } from "@/provider/WalletProvider";
import { Secp256k1Keypair } from "@atproto/crypto";
import { useCallback, useState } from "react";
import debounce from "lodash.debounce"
import usePDSClient from "@/hooks/usePDSClient";
import { USER_DOMAIN } from "@/constant/Network";
import useDebounceWithCancel from "@/hooks/useDebounceWithCancel";
import Loading from "@/components/Loading";

function validateInput(str: string): ValidateResult {
  // 只允许字母、数字、连字符
  if (!/^[a-zA-Z0-9-]+$/.test(str)) {
    return { valid: false, error: "仅支持输入字母、数字和连字符（-）" };
  }
  // 不允许下划线
  if (str.includes("_")) {
    return { valid: false, error: "不支持下划线（_）" };
  }
  // 不能以连字符开头或结尾
  if (str.startsWith("-") || str.endsWith("-")) {
    return { valid: false, error: "不能以连字符（-）开头或结尾" };
  }
  // 长度校验
  if (str.length < 4 || str.length > 18) {
    return { valid: false, error: "长度需为4~18个字符" };
  }
  // 通过
  return { valid: true };
}

type StepNickNameProps = {
  goPrev: () => void
  goNext: () => void;
}


export const StepNickNameLeft = (props: StepNickNameProps) => {
  const { goPrev, goNext } = props;
  const { setNickName, setIsInputFocus, validate, setValidate, resetContext } = useNickName()
  const { disconnect } = useWallet();

  const pdsClient = usePDSClient()

  const [loading, setLoading] = useState(false)

  const onChange = (value: string) => {
    const name = value;
    setNickName(name);
    const validMes = validateInput(name);
    setValidate(validMes);
    if (validMes.valid) {
      valiNameRepeat(name)
    }
  };

  const valiNameRepeat = useCallback(debounce(async (name: string) => {
    setLoading(true)
    const keyPair = await Secp256k1Keypair.create()
    const signingKey = keyPair.did()

    try {
      const res = await pdsClient.com.atproto.web5.preCreateAccount({
        handle: name + `.${USER_DOMAIN}`,
        signingKey,
        did: 'did:plc:n5d3aggygtfxs56gbjkcajxw',
      })
      setValidate((prev) => {
        if (!prev?.valid) return prev;
        return { valid: true, repeatPass: true }
      })
      setLoading(false)
    } catch (err) {
      // const message = err.message === 'Handle not available' ? '名字已经被占用' : err.message;
      setValidate(prev => {
        if (!prev?.valid) return prev;
        return { valid: false, error: '名字已经被占用' }
      })
      setLoading(false)
    }

  }, 500), [])

  const goBack = async () => {
    resetContext()
    await disconnect()
    goPrev()
  }

  const checkedPass = validate?.valid && validate?.repeatPass

  return <div className={S.wrap}>
    <div className={'relative'}>
      <label>设置你的DID名称</label>
      <Input
        onChange={onChange}
        placeholder={'支持由数字或字母或特殊字符“-”组成的名称'}
        onFocus={() => setIsInputFocus(true)}
        onBlur={() => setIsInputFocus(false)}
        checkedPass={checkedPass}
        error={!!validate?.error}
      >
        {loading && <Loading />}
      </Input>
      <div className={cx(S.warning, !validate?.error && '!hidden')}>
        <img
          src={'/assets/warning.svg'}
          alt={'warning'}
        />
        {validate?.error}
      </div>
    </div>

    <div className={S.buttonWrap}>
      <Button className={S.button} onClick={goBack}>上一步</Button>
      <Button type={'primary'} className={S.button} onClick={goNext} disabled={!checkedPass}>下一步</Button>
    </div>
  </div>
}