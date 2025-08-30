import S from "./index.module.scss";

import { useState } from "react";
import BreadCrumbs, { CREATE_ACCOUNT_STEP } from "@/app/register-login/(components)/BreadCrumbs";
import { OnChainRight } from "@/app/register-login/(components)/Steps/OnChain/right";
import useCreateAccount, { CREATE_STATUS } from "@/hooks/useCreateAccount";
import CardLoading from "@/app/register-login/(components)/CardLoading";
import { DragEndEvent, DragStartEvent, useDndMonitor } from "@dnd-kit/core";
import Computer from "@/app/register-login/(components)/Computer";
import DraggableCard from "@/app/register-login/(components)/ComputerCard/DraggableCard";
import { useNickName } from "@/provider/RegisterNickNameProvider";
import ArrowRight from '@/assets/login/arrow-right.svg'
import DotLoading from "@/components/DotLoading";
import cx from "classnames";

const OnChain = (props: {
  goNext: () => void
}) => {
  const { extraIsEnough, loading, createAccount, createStatus, resetCreateStatus } = useCreateAccount({
    createSuccess: props.goNext
  })

  const { nickname } = useNickName()

  const [overInfo, setOverInfo] = useState<DragEndEvent['over']>()

  useDndMonitor({
    onDragStart(event: DragStartEvent) {
      resetCreateStatus()
      setOverInfo(null)
    },
    onDragEnd(event: DragEndEvent) {
      if (!event.over) return
      setOverInfo(event.over)
      createAccount()
    }
  })

  const infoRender = () => {
    if (loading) {
      return <div className={S.info}>身份信息正在传输，存储至CKB区块链中
        <DotLoading />
        {/* 移动端高度占位 */}
        <p>&nbsp;</p>
      </div>
    }
    if (createStatus.reason && createStatus.status === CREATE_STATUS.FAILURE) {
      return <div className={S.err}>
        因{createStatus.reason}原因，信息储存到区块链失败，
        <br />
        请重新尝试拖动左边信息到右边
      </div>
    }

    if (!extraIsEnough[1]) {
      return <div className={S.err}>
        需要至少{extraIsEnough[0]}CKB才能上链储存信息，<br />
        请补充CKB或切换有充足CKB的钱包
      </div>
    }

    return <div className={S.info}>
      拖动ID名片到CKB链，<br />
      授权后即可在区块链上永久存储，不可被第三方篡改
    </div>
  }

  return <div className={S.wrap}>
    <div className={S.top}>
      <BreadCrumbs activeStep={CREATE_ACCOUNT_STEP.ON_CHAIN} />
      <div className={S.leftWrap}>
        <Computer>
          <DraggableCard
            name={nickname}
            disabled={!extraIsEnough[1]}
            loading={loading}
          />
        </Computer>
        {infoRender()}
      </div>
    </div>
    <div className={S.bottom}>
      {loading ? <div className={cx(S.loading, S[overInfo?.id ?? 'B'])}>
        <CardLoading name={nickname || ''} className={S.cardLoading} />
      </div> : <ArrowRight className={S.arrowRight} />}
      <OnChainRight hasErr={createStatus.status === CREATE_STATUS.FAILURE} />
    </div>
  </div>
}

export default OnChain;