'use client'

import S from './index.module.scss'
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ccc } from "@ckb-ccc/connector-react";
import CardWindow from "@/components/CardWindow";
import AppHeader from "@/app/@header/default";
import { useRegisterPopUp } from "@/provider/RegisterPopUpProvider";
import { LayoutCenter } from "@/components/Layout";
import Button from "@/components/Button";
import { useKeystore } from "@/contexts/KeystoreContext";
import storage from "@/lib/storage";
import useUserInfoStore from "@/store/userInfo";
import preloadImage from "@/lib/preloadImage";
import { fetchDidCkbCellsInfo, getWalletAddress } from "@/lib/did";

const PORTAL_URL = 'https://me.web5.fans';

type LoginStep = 'wallet' | 'keystore' | 'login' | 'error';

export default function RegisterLogin() {
  const router = useRouter()
  const { visible, closeRegisterPop } = useRegisterPopUp()
  const { client, connected: keystoreConnected, didKey, isConnecting: keystoreLoading, connect } = useKeystore()
  const { signerInfo, open: openWallet } = ccc.useCcc()
  const [step, setStep] = useState<LoginStep>('wallet')
  const [loggingIn, setLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [didInfo, setDidInfo] = useState<{ did: string; walletAddress: string } | null>(null)
  const [keystoreOpened, setKeystoreOpened] = useState(false)
  const web5Login = useUserInfoStore(state => state.web5Login)

  useEffect(() => {
    if (!visible) return;
    preloadImage('/assets/login/byte-static.png')
    preloadImage('/assets/login/byte-static-m.png')
  }, [visible]);

  useEffect(() => {
    const checkWalletAndDid = async () => {
      if (!signerInfo?.signer) return

      try {
        const walletAddress = await getWalletAddress(signerInfo.signer)
        const didCells = await fetchDidCkbCellsInfo(signerInfo.signer)

        if (didCells.length > 0) {
          const firstDid = didCells[0]
          setDidInfo({ did: firstDid.did, walletAddress })
          setStep('keystore')
        } else {
          setStep('error')
          setLoginError('未找到 DID，请先注册账号')
        }
      } catch (err) {
        console.error('Failed to fetch DID:', err)
        setStep('error')
        setLoginError('查询 DID 失败')
      }
    }

    if (signerInfo?.signer && step === 'wallet') {
      checkWalletAndDid()
    }
  }, [signerInfo, step])

  useEffect(() => {
    const autoLogin = async () => {
      if (!keystoreConnected || !didKey || !client || !didInfo || loggingIn || !keystoreOpened) return

      setLoggingIn(true)
      setStep('login')
      try {
        const result = await web5Login(client, didKey, didInfo.did, didInfo.walletAddress)
        if (result) {
          closeRegisterPop()
          router.replace('/posts')
        } else {
          setStep('error')
          setLoginError('登录失败')
        }
      } catch (error) {
        console.error('Login failed:', error)
        setStep('error')
        setLoginError('登录失败')
      } finally {
        setLoggingIn(false)
      }
    }

    autoLogin()
  }, [keystoreConnected, didKey, client, didInfo, web5Login, closeRegisterPop, router, loggingIn, keystoreOpened])

  const openKeystoreTab = useCallback(() => {
    connect()
    setKeystoreOpened(true)
  }, [connect])

  const openPortal = () => {
    window.open(PORTAL_URL, '_blank')
  }

  if (!visible) return null

  const hasToken = !!storage.getToken()
  if (hasToken) {
    closeRegisterPop()
    return null
  }

  const renderContent = () => {
    switch (step) {
      case 'wallet':
        return (
          <div className={S.status}>
            <p>连接 CKB 钱包</p>
            <p className={S.hint}>请先连接钱包以查询您的 DID 信息</p>
            <Button type="primary" onClick={openWallet}>连接钱包</Button>
          </div>
        )

      case 'keystore':
        if (!keystoreOpened) {
          return (
            <div className={S.status}>
              <p>打开 Keystore</p>
              <p className={S.hint}>请点击下方按钮打开 Keystore 页面</p>
              <Button type="primary" onClick={openKeystoreTab}>打开 Keystore</Button>
            </div>
          )
        }
        if (keystoreLoading) {
          return <div className={S.status}>连接 Keystore 中...</div>
        }
        if (!keystoreConnected) {
          return (
            <div className={S.status}>
              <p>等待 Keystore 连接</p>
              <p className={S.hint}>请在 Keystore 页面完成操作</p>
            </div>
          )
        }
        if (!didKey) {
          return (
            <div className={S.status}>
              <p>Keystore 中没有激活的签名密钥</p>
              <Button onClick={openPortal}>前往 Portal 注册</Button>
            </div>
          )
        }
        return (
          <div className={S.status}>
            <p>正在登录...</p>
            <code className={S.didKey}>{didKey.slice(0, 20)}...{didKey.slice(-8)}</code>
          </div>
        )

      case 'login':
        return (
          <div className={S.status}>
            <p>正在登录...</p>
          </div>
        )

      case 'error':
        return (
          <div className={S.status}>
            <p>{loginError}</p>
            <Button onClick={openPortal}>前往 Portal 注册</Button>
          </div>
        )
    }
  }

  return (
    <div className={S.container}>
      <AppHeader isPopUp />
      <div className={S.layout}>
        <div className={S.bgWrap} />
        <LayoutCenter style={{ overflow: 'initial' }}>
          <CardWindow
            header="登录"
            wrapClassName={S.window}
            headerClassName={S.windowHeader}
            showCloseButton
            onClose={closeRegisterPop}
          >
            <div className={S.loginContent}>
              {renderContent()}

              <div className={S.registerHint}>
                <p>还没有账号？</p>
                <button className={S.link} onClick={openPortal}>
                  前往 Web5 Portal 注册 →
                </button>
              </div>
            </div>
          </CardWindow>
        </LayoutCenter>
      </div>
    </div>
  )
}
