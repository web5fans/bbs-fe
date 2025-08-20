'use client'

import S from './enderButton.module.scss'
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useRegisterPopUp } from "@/provider/RegisterPopUpProvider";
import useUserInfoStore from "@/store/userInfo";
import FlatButton from "@/components/FlatButton";
import Link from "next/link";

const EnterButton = () => {
  const router = useRouter()
  const { openRegisterPop } = useRegisterPopUp()
  const { userInfo } = useUserInfoStore()

  const joinBuild = () => {
    if (!userInfo) {
      openRegisterPop()
      return
    }
    goMainSite()
  }

  const goMainSite = () => router.push('/posts')

  const buttonName = userInfo ? '进入建设' : '加入建设'

  return <div className={S.footer}>
    <Button
      className={S.button}
      type={'primary'}
      onClick={joinBuild}
      onMouseEnter={() => router.prefetch('/posts')}
    >{buttonName}</Button>
    <Link href={'/posts'} prefetch className={userInfo && '!hidden'}>
      <FlatButton className={S.tourist}>
        游客看看
        <div className={S.arrow}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M13 13.4238V15.4238H11V13.4238H13ZM15 13.4238H13V11.4238H15V13.4238ZM17 7.42383H19V9.42383H17V11.4238H15V9.42383H0V7.42383H15V5.42383H17V7.42383ZM15 5.42383H13V3.42383H15V5.42383ZM13 3.42383H11V1.42383H13V3.42383Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </FlatButton>
    </Link>
  </div>
}

export default EnterButton;