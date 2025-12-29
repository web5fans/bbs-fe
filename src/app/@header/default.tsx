'use client'

import S from "./index.module.scss";
import Button from "@/components/Button";
import UserIcon from '@/assets/header/user.svg'
import HomeIcon from '@/assets/header/home.svg'
import FundIcon from '@/assets/header/community-fund.svg'
import PropertyIcon from '@/assets/header/property-manage.svg'
import { useRegisterPopUp } from "@/provider/RegisterPopUpProvider";
import { usePathname, useRouter } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";
import Link from "next/link";
import { JSX } from "react";
import cx from "classnames";
import MouseToolTip from "@/components/MouseToolTip";
import Notification from "./_components/Notification";

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

        <div className={`${S.navigator} ${(props.isPopUp || isIndex) && '!hidden'}`}>
          <NavigatorIcon icon={<HomeIcon />} href={'/posts'} tooltip={'论坛首页'} />
          {hasLoggedIn && <NavigatorIcon
            icon={<FundIcon />}
            href={'/community'}
            tooltip={'社区金库'}
          />}
          {hasLoggedIn && <NavigatorIcon
            icon={<PropertyIcon />}
            href={'/property-manage'}
            tooltip={'社区中心'}
          />}
          {
            hasLoggedIn && <Notification />
          }
          {hasLoggedIn ? <NavigatorIcon icon={<UserIcon />} href={'/user-center'} tooltip={'个人中心'} /> :
          <Button
            type={'primary'}
            className={S.button}
            onClick={openRegisterPop}
          >创建账号加入</Button>}
        </div>
      </div>
    </div>
  </header>
}

function NavigatorIcon({icon, href, tooltip}: {
  icon: JSX.Element
  href: string
  tooltip: string
}) {
  const pathname = usePathname()

  return <MouseToolTip message={tooltip} tipClassName={S.mouseTips}>
    <Link
      href={href}
      prefetch
    >
      <div className={cx(S.icon, pathname === href && S.active)}>
        {icon}
      </div>
    </Link>
  </MouseToolTip>
}