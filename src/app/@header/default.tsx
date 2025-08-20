'use client'

import S from "./index.module.scss";
import Button from "@/components/Button";
import UserIcon from '@/assets/header/user.svg'
import { useRegisterPopUp } from "@/provider/RegisterPopUpProvider";
import { usePathname, useRouter } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function AppHeader(props: {
  isPopUp?: boolean
}) {
  const { hasLoggedIn } = useCurrentUser()
  const { openRegisterPop, closeRegisterPop } = useRegisterPopUp()
  const pathname = usePathname()

  const router = useRouter()

  const isIndex = pathname === '/'

  return <header className={S.header}>
    <div className={S.hContent}>
      <div className={S.lineWrap}>
        {new Array(6).fill(0).map((_, i) => <div
          className={S.line}
          key={i}
        />)}
      </div>
      <div className={S.main}>
        <div className={S.title} onClick={() => {
          if (isIndex) closeRegisterPop()
          router.replace('/')
        }}>
          BBS
        </div>

        <div className={`${S.userWrap} ${(hasLoggedIn || props.isPopUp || isIndex) && '!hidden'}`}>
          <Button
            type={'primary'}
            className={S.button}
            onClick={openRegisterPop}
          >创建账号加入</Button>
        </div>
      </div>
    </div>
  </header>
}