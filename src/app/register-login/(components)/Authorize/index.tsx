'use client'

import S from './index.module.scss'
import CardWindow from "@/components/CardWindow";
import FaceIcon from '@/assets/login/multiDid/face.svg'
import Button from "@/components/Button";
import Computer from "@/app/register-login/(components)/Computer";
import ComputerCard from "@/app/register-login/(components)/ComputerCard";

const Authorize = () => {
  return <CardWindow wrapClassName={S.window}>
    <div className={S.content}>
      <Computer>
        <ComputerCard name={'dddd'} disabled={false} />
      </Computer>

      <div className={S.info}>
        <p className={S.title}>欢迎你！Senxum</p>
        <p className={S.message}>
          是否授权当前设备登录
          <br/>
           你的Web5 DID ?
        </p>

        <div className={S.opt}>
          <Button type={'primary'} className={S.submit}>授权准许</Button>
          <Button className={S.cancel}>取消</Button>
        </div>
      </div>
    </div>
  </CardWindow>
}

export default Authorize;