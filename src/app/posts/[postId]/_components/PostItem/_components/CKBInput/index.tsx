import S from './index.module.scss'
import InputNumber from "@/components/Input/InputNumber";
import InfoSVG from "@/assets/info.svg";
import BBSPopOverMenu from "@/components/BBSPopOverMenu";
import { useWallet } from "@/provider/WalletProvider";
import { useEffect, useMemo, useState } from "react";
import { shannonToCkb } from "@/lib/utils";
import { useToast } from "@/provider/toast";
import { useBoolean } from "ahooks";
import { DotLoading } from "@/components/Loading";

type CKBInputProps = {
  onValueError?: () => void
  onChange: (value: string) => void
  getBalance?: (balance: string) => void
  children?: React.ReactNode
}

const CKBInput = (props: CKBInputProps) => {
  const { signer, address, disconnect } = useWallet()

  const [balance, setBalance] = useState<string | undefined>(undefined)

  const [inputErr, setInputErr] = useState(false)

  const [money, setMoney] = useState('')

  const [balanceLoading, setBalanceLoading] = useBoolean(true)

  const toast = useToast()

  const getBalance = async () => {
    const balance = await signer?.getBalance()
    setBalanceLoading.setFalse()
    if (!balance) {
      setBalance('0')
      props.getBalance?.('0')
      return
    }
    const toCKB = shannonToCkb(balance)
    setBalance(toCKB)
    props.getBalance?.(toCKB)
  }

  useEffect(() => {
    getBalance()
  }, [signer]);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);

    toast({
      title: '复制成功',
      message: address,
      icon: 'success'
    })
  }

  const changeMoney = (value: string) => {
    setMoney(value)
    setInputErr(false)
    props.onChange(value)
  }

  const balanceNoEnough = useMemo(() => {
    const flag = !!balance && balance < 62
    if(flag) props.onValueError?.()
    return flag
  }, [balance])

  return <div className={S.wrap}>
    <div className={S.top}>
      <span className={S.title}>打赏金额</span>
      <div className={S.balance}>CKB余额:&nbsp;
        {balanceLoading ? <p>获取中<DotLoading /></p> : <span>{balance} CKB</span>}
      </div>
    </div>

    <InputNumber
      wrapClassName={S.inputWrap}
      placeholder={'请输入打赏金额，最多两位小数'}
      min={1}
      pattern={/^\d+(\.\d{0,2})?$/}
      onChange={changeMoney}
      error={inputErr}
      onError={() => {
        setInputErr(true)
        props.onValueError?.()
      }}
      inputValue={money}
    >
      <span>CKB</span>
    </InputNumber>

    <CKBButtons onChange={changeMoney} />
    {balanceNoEnough ? <p className={S.error}>
      <InfoSVG className={S.icon} />
      <BBSPopOverMenu menus={[{ title: '复制钱包地址充值CKB', onClick: copyAddress }, { title: '断开连接', onClick: disconnect }]}>
        <span className={'cursor-pointer'}>至少需要62CKB才能打赏</span>
      </BBSPopOverMenu>
    </p> : props.children}
  </div>
}

export default CKBInput;

function CKBButtons({ onChange } : {
  onChange: (v: string) => void
}) {
  return <div className={S.ckbButtons}>
    {['1', '2', '5', '10'].map((v, i) => (<span onClick={() => onChange(v)}>{v} CKB</span>))}
  </div>
}