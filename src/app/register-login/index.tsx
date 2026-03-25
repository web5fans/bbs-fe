'use client'

import S from './index.module.scss'
import { useEffect, useState } from "react";
import CardWindow from "@/components/CardWindow";
import AppHeader from "@/app/@header/default";
import { useRegisterPopUp } from "@/provider/RegisterPopUpProvider";
import { LayoutCenter } from "@/components/Layout";
import Button from "@/components/Button";
import { useKeystore } from "@/contexts/KeystoreContext";
import storage from "@/lib/storage";
import useUserInfoStore from "@/store/userInfo";
import preloadImage from "@/lib/preloadImage";

const PORTAL_URL = 'https://me.web5.fans';

export default function RegisterLogin() {
  const { visible, closeRegisterPop } = useRegisterPopUp()
  const { client, connected, didKey, isLoading } = useKeystore()
  const [loggingIn, setLoggingIn] = useState(false)
  const web5Login = useUserInfoStore(state => state.web5Login)

  useEffect(() => {
    if (!visible) return;
    preloadImage('/assets/login/byte-static.png')
    preloadImage('/assets/login/byte-static-m.png')
  }, [visible]);

  const handleLogin = async () => {
    if (!client || !didKey) return
    
    setLoggingIn(true)
    try {
      await web5Login(client, didKey)
      closeRegisterPop()
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setLoggingIn(false)
    }
  }

  const openPortal = () => {
    window.open(PORTAL_URL, '_blank')
  }

  if (!visible) return null

  const hasToken = !!storage.getToken()
  if (hasToken) {
    closeRegisterPop()
    return null
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
              {isLoading ? (
                <div className={S.status}>连接 Keystore 中...</div>
              ) : !connected ? (
                <div className={S.status}>
                  <p>无法连接到 Keystore</p>
                  <Button onClick={openPortal}>前往 Portal 注册</Button>
                </div>
              ) : !didKey ? (
                <div className={S.status}>
                  <p>Keystore 中没有激活的签名密钥</p>
                  <p className={S.hint}>请先注册账号并创建签名密钥</p>
                  <Button onClick={openPortal}>前往 Portal 注册</Button>
                </div>
              ) : (
                <div className={S.status}>
                  <p>检测到签名密钥</p>
                  <code className={S.didKey}>{didKey.slice(0, 20)}...{didKey.slice(-8)}</code>
                  <Button 
                    type="primary" 
                    onClick={handleLogin}
                    disabled={loggingIn}
                  >
                    {loggingIn ? '登录中...' : '登录'}
                  </Button>
                </div>
              )}
              
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
