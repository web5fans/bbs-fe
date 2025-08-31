'use client'

import S from "./index.module.scss";
import cx from "classnames";
import { useRouter } from "next/navigation";

type Props = {
  breads: { title: string; route?: string, onClick?: () => void }[]
  className?: string
}

const BreadCrumbs = ({ breads, className }: Props) => {
  const router = useRouter();

  return <div className={cx(S.breadCrumb, className)}>
    {breads.map(({ title, route, onClick }, index) => {
      return <div key={index} className={'flex items-center capitalize'}>
        {index !== 0 && <Arrow className={S.arrow} />}
        {(route || onClick) ? <a onClick={() => {
          if (onClick) {
            onClick()
            return
          }
          router.replace(route)
        }}>{title}</a> : <span>{title}</span>}
      </div>
    })}
  </div>
}

export default BreadCrumbs;

function Arrow(props: {className?: string}) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    className={props.className}
  >
    <path
      d="M9.5 15.5H8.5V14.5H9.5V15.5ZM10.5 14.5H9.5V13.5H10.5V14.5ZM11.5 13.5H10.5V12.5H11.5V13.5ZM12.5 12.5H11.5V11.5H12.5V12.5ZM13.5 11.5H12.5V10.5H13.5V11.5ZM12.5 10.5H11.5V9.5H12.5V10.5ZM11.5 9.5H10.5V8.5H11.5V9.5ZM10.5 8.5H9.5V7.5H10.5V8.5ZM9.5 7.5H8.5V6.5H9.5V7.5Z"
      fill="black"
    />
  </svg>
}