'use client'

import { useKeystore } from '@/contexts/KeystoreContext'
import { ccc } from '@ckb-ccc/connector-react'
import WalletIcon from '@/assets/header/wallet.svg'
import KeystoreIcon from '@/assets/header/keystore.svg'
import S from './index.module.scss'
import cx from 'classnames'

export default function ConnectionStatusIcons() {
  const { connected: keystoreConnected, openKeystore } = useKeystore()
  const { signerInfo, open: openWallet } = ccc.useCcc()

  const walletConnected = !!signerInfo

  const handleWalletClick = () => {
    if (!walletConnected) {
      openWallet()
    }
  }

  const handleKeystoreClick = () => {
    if (!keystoreConnected) {
      openKeystore()
    }
  }

  return (
    <div className={S.container}>
      <div 
        className={cx(S.icon, !walletConnected && S.disconnected)}
        onClick={handleWalletClick}
      >
        <WalletIcon />
        {!walletConnected && <span className={S.indicator} />}
      </div>

      <div 
        className={cx(S.icon, !keystoreConnected && S.disconnected)}
        onClick={handleKeystoreClick}
      >
        <KeystoreIcon />
        {!keystoreConnected && <span className={S.indicator} />}
      </div>
    </div>
  )
}
