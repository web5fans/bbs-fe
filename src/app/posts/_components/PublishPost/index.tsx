'use client'

import S from './index.module.scss'
import Button from "@/components/Button";
import useUserInfoStore from "@/store/userInfo";
import MouseToolTip from "@/components/MouseToolTip";
import { useRouter } from "next/navigation";

const PublishPost = () => {
  const { userInfo } = useUserInfoStore()
  const router = useRouter()


  return <MouseToolTip open={!userInfo}>
    <Button
      type={'primary'}
      className={S.button}
      disabled={!userInfo}
      onClick={() => router.push('/posts/publish')}
      showClickAnimate={false}
    >
      <Icon />
      发布讨论
    </Button>
  </MouseToolTip>
}

export default PublishPost;

function Icon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="23"
    height="22"
    viewBox="0 0 23 22"
    fill="none"
  >
    <path
      d="M18.5 22.001H4.5V20.001H18.5V22.001ZM4.5 18.001V20.001L2.5 20V18L4.5 18.001ZM20.5 20.001H18.5V18.001H20.5V20.001ZM2.5 18L0.5 18.001V4.00098H2.5V18ZM22.5 18.001H20.5V4.00098H22.5V18.001ZM12.5 6.00098V10.001H16.5V12.001H12.5V16.001L10.5 16V12.001H6.5V10.001H10.5V6L12.5 6.00098ZM4.5 4.00098H2.5V2.00098H4.5V4.00098ZM20.5 2.00098V4.00098L18.5 4V2L20.5 2.00098ZM18.5 2L4.5 2.00098V0H18.5V2Z"
      fill="currentColor"
    />
  </svg>
}