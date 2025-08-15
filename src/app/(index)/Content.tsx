import S from './content.module.scss'
import DashedDivide from "@/components/DashedDivide";
import EnterButton from "@/app/(index)/EnterButton";
import CardWindow from "@/components/CardWindow";
import useUserInfoStore from "@/store/userInfo";
import { handleToNickName } from "@/lib/handleToNickName";
import cx from "classnames";

const Content = () => {
  const { userInfo } = useUserInfoStore()

  return <CardWindow header={'字节建设者公社'} wrapClassName={S.container}>
    <div className={S.inner}>
      <div className={S.content}>
        <div className={S.title}>
          <DashedDivide className={S.titleDivide} />
          <span className={cx(S.text, userInfo && S.user)}>
            {userInfo ? `欢迎你，${handleToNickName(userInfo.handle)}` : '欢迎来到BBS'}
          </span>
          <DashedDivide className={S.titleDivide} />
        </div>
        <p>
          字节建设者公社（Byte Builders Society，BBS）是一个面向华语世界的 开源开放、创意优先、社区驱动的科技人文公社。在云端封建主义时代，BBS
          坚守技术自由主义，致力于建设并推广 Web5 技术栈（ATP + BTC / CKB + Fiber），以实现数字世界自由迁徙的愿景。
        </p>
        <br />
        <p>
          如同当年的《全球概览》, BBS 将汇聚工具、资源与思想，为所有投身于建设开放自治数字世界的人们提供工具箱与勇气。
        </p>
        <DashedDivide className={S.divide} />
      </div>

      <div className={S.buttonWrap}>
        <EnterButton />
      </div>
    </div>
  </CardWindow>

}

export default Content;