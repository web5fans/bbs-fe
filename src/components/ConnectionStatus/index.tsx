'use client'

import { useKeystore } from '@/contexts/KeystoreContext'
import { ccc } from '@ckb-ccc/connector-react'
import Button from '@/components/Button'
import S from './index.module.scss'

export default function ConnectionStatus() {
  const { connected: keystoreConnected, openKeystore } = useKeystore()
  const { signerInfo, open: openWallet } = ccc.useCcc()

  const walletConnected = !!signerInfo

  if (keystoreConnected && walletConnected) {
    return null
  }

  return (
    <div className={S.container}>
      <div className={S.content}>
        <span className={S.message}>
          连接已断开，请重新连接：
        </span>
        <div className={S.buttons}>
          {!walletConnected && (
            <Button type="primary" onClick={openWallet}>
              连接钱包
            </Button>
          )}
          {!keystoreConnected && (
            <Button type="primary" onClick={openKeystore}>
              打开 Keystore
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
