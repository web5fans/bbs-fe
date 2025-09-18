'use client'

import S from './index.module.scss'
import AvatarUserIcon from '@/assets/login/intro/user.svg'
import CheckIcon from '@/assets/login/intro/check.svg'
import Button from "@/components/Button";
import { useEffect } from "react";
import { useWallet } from "@/provider/WalletProvider";
import ExistDidPopUp from "./ExistDidPopUp";

type IntroLeftProps = {
  goNext: () => void;
  showImport: (type: 'file' | 'scan') => void
}

export const IntroLeft = (props: IntroLeftProps) => {
  const { openSigner, isConnected } = useWallet();

  useEffect(() => {
    if (isConnected) {
      props.goNext()
    }
  }, [isConnected]);

  return <div className={S.wrap}>
    <div className={S.inner}>
      <AvatarUserIcon className={S.avatar} />

      <div>
        <p className={S.title}>创建你的个人Web5 DID 账号，获得：</p>
        {
          [
            '存储于CKB链的数据档案库',
            '发布和回复帖子权限',
            '专属域名（如yuming.bbs.xyz）',
          ].map((mes, idx) => {
            return <div className={S.mesItem} key={idx}>
              <CheckIcon className={S.check} />
              <p>{mes}</p>
            </div>
          })
        }
      </div>

      <div className={S.footer}>
        <Button
          type={'primary'}
          className={S.button}
          onClick={openSigner}
        >连接钱包创建</Button>

        <ExistDidPopUp
          popItems={[{
            name: '导入Web5 DID密钥登录',
            onClick: () => props.showImport('file')
          }, {
            name: '扫一扫登录',
            onClick: () => props.showImport('scan')
          }]}
        >
          <Button
            className={S.button}
          >已有Web5 DID</Button>
        </ExistDidPopUp>
      </div>
    </div>
  </div>
}