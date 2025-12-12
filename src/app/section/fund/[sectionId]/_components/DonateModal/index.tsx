import S from './index.module.scss'
import { useWallet } from "@/provider/WalletProvider";
import { useState } from "react";
import { useBoolean, useCountDown } from "ahooks";
import { useToast } from "@/provider/toast";
import storage from "@/lib/storage";
import { Secp256k1Keypair } from "@atproto/crypto";
import * as cbor from "@ipld/dag-cbor";
import server from "@/server";
import { uint8ArrayToHex } from "@/lib/dag-cbor";
import { ccc, Transaction } from "@ckb-ccc/core";
import CardWindow from "@/components/CardWindow";
import CopyText from "@/components/CopyText";
import CKBInput from "@/app/posts/[postId]/_components/PostItem/_components/CKBInput";
import InfoSVG from "@/assets/info.svg";
import Button from "@/components/Button";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import Modal from "@/components/Modal";
import { NSID_TYPE_ENUM } from "@/constant/types";
import FundIcon from '@/assets/fund/fund-fill.svg'
import dayjs from "dayjs";

type ModalContentProps = {
  onClose: () => void;
  receiveCKBAddr: string
  nsid: NSID_TYPE_ENUM
  onConfirm?: (ckbAmount: string) => void
}

const DonateModal = (props: {
  visible: boolean;
} & ModalContentProps) => {
  const { visible, onClose, ...rest } = props;
  const { signer, openSigner } = useWallet()

  if (!signer) {
    return <ConfirmModal
      visible={visible}
      message={'请连接钱包后再打赏'}
      modalClassName={S.connectWallet}
      footer={{
        confirm: {
          text: '连接钱包',
          onClick: openSigner
        },
        cancel: {
          text: '关闭',
          onClick: onClose
        }
      }}
    />
  }

  return <Modal visible={visible} onlyMask>
    <ModalContent onClose={onClose} {...rest} />
  </Modal>
}

export default DonateModal;

type TipPrepareResponseType = {
  payment: {
    paymentId: string
    rawTx: string
    txHash: string
  }
  tip: {
    id: string
    amount: string
    sender: string
    receiver: string
    info: string
    tx_hash: string
    state: string
    created: string
    updated: string
  }
}

function ModalContent({ onClose, receiveCKBAddr, nsid, onConfirm }: ModalContentProps) {
  const { signer, address } = useWallet()

  const [ckbValueErr, setCKBValueErr] = useState(false)

  const [money, setMoney] = useState('')

  const [loading, setLoading] = useBoolean(false)

  const [leftTime, setLeftTime] = useState<number>()

  const [_, formattedRes] = useCountDown({
    leftTime,
    onEnd: () => {
      setLeftTime(undefined)
      setLoading.setFalse()
    }
  });

  const toast = useToast()

  const changeMoney = (value: string) => {
    setMoney(value)
    setCKBValueErr(false)
  }

  const confirm = async () => {
    setLoading.setTrue()
    const storageInfo = storage.getToken()

    if (!storageInfo?.signKey) return

    const { signKey, did } = storageInfo

    const keyPair = await Secp256k1Keypair.import(signKey?.slice(2))

    const signingKey = keyPair.did()

    const ckbAmount = money * Math.pow(10, 8) + ''

    const params = {
      nsid,
      ckb_addr: receiveCKBAddr,
      amount: ckbAmount,
      sender: address,
      timestamp: dayjs().utc().unix()
    }

    const encoded = cbor.encode(params)
    const sig = await keyPair.sign(encoded)

    const response = await server<TipPrepareResponseType>('/donate/prepare', 'POST', {
      did,
      signing_key_did: signingKey,
      params,
      signed_bytes: uint8ArrayToHex(sig),
    }).catch(e => {
      const { data } = e.response
      const mes = data.message === 'INSUFFICIENT_BALANCE' ? '余额不足' : data.message
      toast({
        title: '失败',
        message: mes,
        icon: 'error'
      })
      setLoading.setFalse()
    })
    const { payment } = response
    const rawTx = JSON.parse(payment.rawTx)
    const tx = Transaction.from(rawTx)

    setLeftTime(60 * 1000)

    let result
    try {
      result = await signer?.signTransaction(tx)
    } catch (error) {}

    setLeftTime(undefined)

    if (!result) {
      setLoading.setFalse()
      toast({
        title: '签名失败',
        icon: 'error'
      })
      return
    }

    /* 第二步 */
    let secondResultRes

    try {
      secondResultRes = await server('/donate/transfer', 'POST', {
        paymentId: payment.paymentId,
        signedTx: ccc.stringify(result)
      })
    } catch (e) {}

    setLoading.setFalse()

    if (secondResultRes?.status === 'completed') {
      toast({
        title: '捐赠成功',
        icon: 'success'
      })
      onConfirm?.(ckbAmount)
    } else {
      toast({
        title: '捐赠失败',
        message: secondResultRes?.error,
        icon: 'error'
      })
    }
  }

  return <CardWindow header={'捐赠'} wrapClassName={S.modal} showCloseButton onClose={onClose}>

    <div className={S.container}>
      <div className={S.info}>
        <FundIcon className={S.fundIcon} />
        <div>
          <p className={S.name}>金库地址</p>
          <CopyText
            text={receiveCKBAddr}
            ellipsis
            className={{ wrap: S.address }}
          />
        </div>
      </div>

      <CKBInput
        inputLabel={'捐赠金额'}
        onChange={changeMoney}
        onValueError={() => setCKBValueErr(true)}
        placeholder={'请输入捐赠金额，最多两位小数'}
        tip={'捐赠'}
      >
        {!!formattedRes.seconds && <div className={S.error}>
          此次操作将在{formattedRes.seconds}s后超时
        </div>}
      </CKBInput>

      {
        ['最小捐赠金额：1 CKB'].map(i => {
          return <p className={S.message}>
            <InfoSVG className={S.icon} />
            <span>{i}</span>
          </p>
        })
      }

      <div className={S.footer}>
        <Button
          className={S.cancel}
          onClick={onClose}
        >取消</Button>
        <Button
          type={'primary'}
          className={S.submit}
          disabled={ckbValueErr || !money || loading}
          onClick={confirm}
        >确认</Button>
      </div>
    </div>
  </CardWindow>
}