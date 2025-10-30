import Modal from "@/components/Modal";
import CardWindow from "@/components/CardWindow";
import { useWallet } from "@/provider/WalletProvider";
import S from './index.module.scss'
import { useEffect } from "react";
import Button from "@/components/Button";
import { shannonToCkb } from "@/lib/utils";
import Input from "@/components/Input";
import useCurrentUser from "@/hooks/useCurrentUser";
import Avatar from "@/components/Avatar";
import ellipsis from "@/lib/ellipsis";
import InfoSVG from '@/assets/info.svg'
import WarningIcon from '@/assets/warning-black.svg'
import Copy from "@/components/CopyText/Copy";

const DonateModal = (props: {
  visible: boolean;
}) => {
  const { visible } = props;
  const { userProfile } = useCurrentUser()
  const { signer, openSigner, walletClient, address } = useWallet()

  useEffect(() => {
    if (!visible) return
    getBalance()
  }, [visible]);

  const getBalance = async () => {
    const balance = await signer?.getBalance()
    console.log('balance', balance, shannonToCkb(balance))

  }

  if (!signer) {
    return <Modal visible={visible}>
      <div className={S.connectWallet}>
        <div className={S.infoWrap}>
          <WarningIcon className={S.warning} />
          <span>请连接钱包后再打赏</span>
        </div>
        <Button onClick={openSigner} type={'primary'} className={S.connect}>连接钱包</Button>
      </div>
    </Modal>
  }

  return <Modal visible={visible} onlyMask>
    <CardWindow header={'打赏作者'} wrapClassName={S.modal} showCloseButton>
      <div className={S.container}>
        <div className={S.userInfo}>
          <Avatar nickname={userProfile?.displayName} className={S.avatar} />
          <div>
            <p className={S.name}>{userProfile?.displayName}</p>
            <p className={S.address}>
              <span>{ellipsis(address)}</span>
              <Copy text={address} />
            </p>
          </div>
        </div>
        <div className={S.content}>
          <div className={S.top}>
            <span className={S.title}>打赏金额</span>
            <span className={S.balance}>CKB余额: 33323CKB</span>
          </div>

          <Input wrapClassName={S.inputWrap} placeholder={'请输入打赏金额'} inputMode={'decimal'}>
            <span>CKB</span>
          </Input>

          <CKBButtons />
          <p className={S.error}>
            <InfoSVG className={S.icon} />
            <span>至少需要xxCKB才能打赏</span>
          </p>
        </div>

        <p className={S.message}>
          <InfoSVG className={S.icon} />
          <span>金额分配说明：作者得70%，版区基金得20%，社区基金得10%</span>
        </p>

        <div className={S.footer}>
          <Button className={S.cancel}>取消</Button>
          <Button type={'primary'} className={S.submit}>确认打赏</Button>
        </div>
      </div>
    </CardWindow>
  </Modal>
}

export default DonateModal;

function CKBButtons() {
  return <div className={S.ckbButtons}>
    <span>1 CKB</span>
    <span>2 CKB</span>
    <span>5 CKB</span>
    <span>10 CKB</span>
  </div>
}