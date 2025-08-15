import S from './index.module.scss'
import ChangeIcon from '@/assets/login/intro/change.svg'
import { useState } from "react";
import cx from "classnames";
import FlatButton from "@/components/FlatButton";

const contents = [{
  title: 'Web2 + Web3',
  info: 'Web5 是将 Web3/密码学融入到现有的 Web2 框架里面去，解决 Web2 自己解决不了的问题——既保持了Web2的良好用户体验，又实现了Web3追求的去中心化、抗审查和用户数据主权目标。',
  author: 'Janx'
}, {
  title: '基于 PoW+UTXO 系统的点对点网络',
  info: 'Web5 是构建于点对点拓扑之上的去中心化生态系统，基于 PoW 与 UTXO 体系，致力于实现真正的去中心化、抗审查、无需许可和数据自托管的愿景。',
  author: 'Matt'
}, {
  title: '去中心化的 Web 平台',
  info: 'Web5 is a Decentralized Web Platform that enables developers to leverage Decentralized Identifiers, Verifiable Credentials, and Decentralized Web Nodes to write Decentralized Web Apps, returning ownership and control over identity and data to individuals. ',
  author: 'Dorsey',
  className: S.inner1
}]

export const IntroRight = () => {
  const [contentIdx, setContentIdx] = useState(0)

  const randomChange = () => {
    const next = contentIdx + 1
    const num = next > 2 ? 0 : next;
    setContentIdx(num)
  }

  const displayContent = contents[contentIdx]

  return <div className={S.wrap}>
    <p className={S.header}>Web5 是什么？</p>

    <div className={S.content}>
      <div className={S.bt}/>
      <div className={S.br}/>
      <div className={S.bb}/>
      <div className={S.bl}/>
      <div className={cx(S.inner, displayContent.className)}>
        <p className={S.title}>{displayContent.title}</p>
        <p className={S.info}>{displayContent.info}</p>
        <p className={S.author}>
          —— {displayContent.author}
        </p>
      </div>
    </div>

    <FlatButton className={S.change} onClick={randomChange}>
      <ChangeIcon />
      换一换
    </FlatButton>
  </div>
}

