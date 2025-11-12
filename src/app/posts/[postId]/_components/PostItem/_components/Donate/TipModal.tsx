import Modal from "@/components/Modal";
import CardWindow from "@/components/CardWindow";
import { useWallet } from "@/provider/WalletProvider";
import S from './index.module.scss'
import { useState } from "react";
import Button from "@/components/Button";
import Avatar from "@/components/Avatar";
import InfoSVG from '@/assets/info.svg'
import ConfirmModal from "@/components/Modal/ConfirmModal";
import CopyText from "@/components/CopyText";
import storage from "@/lib/storage";
import { Secp256k1Keypair } from "@atproto/crypto";
import * as cbor from "@ipld/dag-cbor";
import server from "@/server";
import { uint8ArrayToHex } from "@/lib/dag-cbor";
import { ccc, Transaction } from "@ckb-ccc/core";
import { useBoolean, useCountDown } from "ahooks";
import CKBInput from "../CKBInput";
import { useToast } from "@/provider/toast";

export type AuthorType = {
  displayName: string;
  did: string
}

type ModalContentProps = {
  onClose: () => void;
  author: AuthorType
  uri: string
  nsid: 'app.bbs.post' | 'app.bbs.comment' | 'app.bbs.reply'
  onConfirm: (ckbAmount: string) => void
}

const TipModal = (props: {
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

export default TipModal;

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

function ModalContent({ onClose, author, uri, nsid, onConfirm }: ModalContentProps) {
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
      uri,
      amount: ckbAmount,
      sender: address
    }

    const encoded = cbor.encode(params)
    const sig = await keyPair.sign(encoded)

    const response = await server<TipPrepareResponseType>('/tip/prepare', 'POST', {
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
      secondResultRes = await server('/tip/transfer', 'POST', {
        paymentId: payment.paymentId,
        signedTx: ccc.stringify(result)
      })
    } catch (e) {}

    setLoading.setFalse()

    if (secondResultRes?.status === 'completed') {
      toast({
        title: '打赏成功',
        icon: 'success'
      })
      onConfirm(ckbAmount)
    } else {
      toast({
        title: '打赏失败',
        message: secondResultRes?.error,
        icon: 'error'
      })
    }
  }

  return <CardWindow header={'打赏作者'} wrapClassName={S.modal} showCloseButton onClose={onClose}>

    <div className={S.container}>
      <div className={S.userInfo}>
        <Avatar
          nickname={author.displayName}
          className={S.avatar}
        />
        <div>
          <p className={S.name}>{author.displayName}</p>
          <CopyText
            text={author.did}
            ellipsis
            className={{ wrap: S.address }}
          />
        </div>
      </div>

      <CKBInput onChange={changeMoney} onValueError={() => setCKBValueErr(true)} >
        {!!formattedRes.seconds && <div className={S.error}>
          此次打赏操作将在{formattedRes.seconds}s后超时
        </div>}
      </CKBInput>

      {
        ['最小打赏金额：1 CKB', '金额分配说明：作者得70%，版区基金得20%，社区基金得10%'].map(i => {
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
        >确认打赏</Button>
      </div>
    </div>
  </CardWindow>
}