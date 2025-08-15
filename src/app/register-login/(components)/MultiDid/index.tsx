'use client'

import S from './index.module.scss'
import CardWindow from "@/components/CardWindow";
import FaceIcon from '@/assets/login/multiDid/face.svg'
import Button from "@/components/Button";

const MultiDid = () => {
  return <CardWindow wrapClassName={S.window}>
    <div className={S.content}>
      <FaceIcon />
      <p className={S.info}>ops,暂时不支持钱包内含多个 Web5 DID进入主站</p>
      <Button type={'primary'} className={S.button}>
        切换钱包连接
      </Button>
    </div>
  </CardWindow>
}

export default MultiDid;