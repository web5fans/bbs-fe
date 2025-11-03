import Modal from "@/components/Modal";
import CardWindow from "@/components/CardWindow";
import { useWallet } from "@/provider/WalletProvider";
import S from './index.module.scss'
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import { shannonToCkb } from "@/lib/utils";
import useCurrentUser from "@/hooks/useCurrentUser";
import Avatar from "@/components/Avatar";
import InfoSVG from '@/assets/info.svg'
import InputNumber from "@/components/Input/InputNumber";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import CopyText from "@/components/CopyText";

const DonateModal = (props: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { visible, onClose } = props;
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
    <ModalContent onClose={onClose} />
  </Modal>
}

export default DonateModal;

function ModalContent({ onClose }: {
  onClose: () => void;
}) {
  const { userProfile } = useCurrentUser()
  const { signer, address } = useWallet()

  const [balance, setBalance] = useState('0')

  const [disabled, setDisabled] = useState(false)

  const getBalance = async () => {
    const balance = await signer?.getBalance()
    if (!balance) return
    const toCKB = shannonToCkb(balance)
    setBalance(toCKB)
  }

  useEffect(() => {
    getBalance()
  }, [signer]);

  const balanceNoEnough = balance < '62'

  return <CardWindow header={'打赏作者'} wrapClassName={S.modal} showCloseButton onClose={onClose}>
    <div className={S.container}>
      <div className={S.userInfo}>
        <Avatar nickname={userProfile?.displayName} className={S.avatar} />
        <div>
          <p className={S.name}>{userProfile?.displayName}</p>
          <CopyText text={address} ellipsis className={{ wrap: S.address }} />
        </div>
      </div>
      <div className={S.content}>
        <div className={S.top}>
          <span className={S.title}>打赏金额</span>
          <span className={S.balance}>CKB余额: {balance} CKB</span>
        </div>

        <InputNumber wrapClassName={S.inputWrap} placeholder={'请输入打赏金额'}>
          <span>CKB</span>
        </InputNumber>

        <CKBButtons />
        {balanceNoEnough && <p className={S.error}>
          <InfoSVG className={S.icon} />
          <span>至少需要62CKB才能打赏</span>
        </p>}
      </div>

      <p className={S.message}>
        <InfoSVG className={S.icon} />
        <span>金额分配说明：作者得70%，版区基金得20%，社区基金得10%</span>
      </p>

      <div className={S.footer}>
        <Button className={S.cancel} onClick={onClose}>取消</Button>
        <Button type={'primary'} className={S.submit} disabled={balanceNoEnough || disabled}>确认打赏</Button>
      </div>
    </div>
  </CardWindow>
}

function CKBButtons() {
  return <div className={S.ckbButtons}>
    <span>1 CKB</span>
    <span>2 CKB</span>
    <span>5 CKB</span>
    <span>10 CKB</span>
  </div>
}