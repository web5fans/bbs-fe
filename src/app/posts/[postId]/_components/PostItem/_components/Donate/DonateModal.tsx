import Modal from "@/components/Modal";
import CardWindow from "@/components/CardWindow";
import { useWallet } from "@/provider/WalletProvider";
import S from './index.module.scss'
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import { shannonToCkb } from "@/lib/utils";
import Avatar from "@/components/Avatar";
import InfoSVG from '@/assets/info.svg'
import InputNumber from "@/components/Input/InputNumber";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import CopyText from "@/components/CopyText";
import BBSPopOverMenu from "@/components/BBSPopOverMenu";
import { useToast } from "@/provider/toast";
import storage from "@/lib/storage";
import { Secp256k1Keypair } from "@atproto/crypto";
import * as cbor from "@ipld/dag-cbor";
import server from "@/server";
import { uint8ArrayToHex } from "@/lib/dag-cbor";
import { ccc, Transaction } from "@ckb-ccc/core";
import { useBoolean } from "ahooks";

export type AuthorType = {
  displayName: string;
  did: string
}

type ModalContentProps = {
  onClose: () => void;
  author: AuthorType
  uri: string
  nsid: 'app.bbs.post' | 'app.bbs.comment' | 'app.bbs.reply'
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

function ModalContent({ onClose, author, uri, nsid }: ModalContentProps) {
  const { signer, address } = useWallet()

  const [balance, setBalance] = useState<string | undefined>(undefined)

  const [inputErr, setInputErr] = useState(false)

  const [money, setMoney] = useState('')

  const [loading, setLoading] = useBoolean(false)

  const toast = useToast()

  const getBalance = async () => {
    const balance = await signer?.getBalance()
    if (!balance) {
      setBalance('0')
      return
    }
    const toCKB = shannonToCkb(balance)
    setBalance(toCKB)
  }

  useEffect(() => {
    getBalance()
  }, [signer]);

  const changeMoney = (value: string) => {
    setMoney(value)
    setInputErr(false)
  }

  const confirm = async () => {
    setLoading.setTrue()
    const storageInfo = storage.getToken()

    if (!storageInfo?.signKey) return

    const { signKey, did } = storageInfo

    const keyPair = await Secp256k1Keypair.import(signKey?.slice(2))

    const signingKey = keyPair.did()
    const params = {
      nsid,
      uri,
      amount: money,
      sender: address
    }

    const encoded = cbor.encode(params)
    const sig = await keyPair.sign(encoded)

    const response = await server<TipPrepareResponseType>('/tip/prepare', 'POST', {
      did,
      signing_key_did: signingKey,
      params,
      signed_bytes: uint8ArrayToHex(sig),
    })
    const { payment } = response
    const rawTx = JSON.parse(payment.rawTx)
    const tx = Transaction.from(rawTx)

    console.log('tx>>>', tx)
    let result
    try {
      result = await signer?.signTransaction(tx)
    } catch (error) {
      setLoading.setFalse()
    }

    console.log('signed--result>>>>', result)

    if (!result) return

    await server('/tip/transfer', 'POST', {
      payment_id: payment.paymentId,
      signed_tx: ccc.stringify(result)
    })
    setLoading.setFalse()
    onClose()
  }

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);

    toast({
      title: '复制成功',
      message: address,
      icon: 'success'
    })
  }

  const balanceNoEnough = !!balance && balance < 62

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
      <div className={S.content}>
        <div className={S.top}>
          <span className={S.title}>打赏金额</span>
          <span className={S.balance}>CKB余额: {balance} CKB</span>
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
          }}
          inputValue={money}
        >
          <span>CKB</span>
        </InputNumber>

        <CKBButtons onChange={changeMoney} />
        {balanceNoEnough && <p className={S.error}>
          <InfoSVG className={S.icon} />
          <BBSPopOverMenu menus={[{title: '复制钱包地址充值CKB', onClick: copyAddress}]}>
            <span className={'cursor-pointer'}>至少需要62CKB才能打赏</span>
          </BBSPopOverMenu>
        </p>}
      </div>

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
          disabled={balanceNoEnough || !money}
          onClick={confirm}
        >确认打赏</Button>
      </div>
    </div>
  </CardWindow>
}

function CKBButtons({ onChange } : {
  onChange: (v: string) => void
}) {
  return <div className={S.ckbButtons}>
    {['1', '2', '5', '10'].map((v, i) => (<span onClick={() => onChange(v)}>{v} CKB</span>))}
  </div>
}