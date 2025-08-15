'use client'

import S from './index.module.scss'
import { DndContext } from "@dnd-kit/core";
import { DraggableOverlay } from "./(components)/ComputerCard/DraggableOverlay";
import { useEffect, useMemo, useState } from "react";
import CardWindow from "@/components/CardWindow";
import BreadCrumbs, { CREATE_ACCOUNT_STEP } from "./(components)/BreadCrumbs";
import { SetNickNameProvider } from "@/provider/RegisterNickNameProvider";
import { StepNickNameLeft, StepNickNameRight } from "./(components)/Steps/NickName";
import OnChain from "@/app/register-login/(components)/Steps/OnChain";
import { IntroLeft, IntroRight } from "@/app/register-login/(components)/Steps/Intro";
import { CompleteLeft, CompleteRight } from './(components)/Steps/Complete';
import MultiDid from "@/app/register-login/(components)/MultiDid";
import Authorize from "@/app/register-login/(components)/Authorize";
import AppHeader from "@/app/@header/default";
import { useRegisterPopUp } from "@/provider/RegisterPopUpProvider";
import cx from "classnames";

export default function RegisterLogin() {
  const { visible, closeRegisterPop } = useRegisterPopUp()
  const [curStep, setCurSep] = useState<CREATE_ACCOUNT_STEP>(CREATE_ACCOUNT_STEP.INTRO)

  const goPrev = () => {
    setCurSep(v => v - 1)
  }

  useEffect(() => {
    if (!visible) {
      setCurSep(CREATE_ACCOUNT_STEP.INTRO)
    }
  }, [visible]);

  const stepRender = useMemo(() => {
    switch (curStep) {
      case CREATE_ACCOUNT_STEP.INTRO: {
        return <>
          <Left>
            <IntroLeft goNext={() => setCurSep(CREATE_ACCOUNT_STEP.NICKNAME)} />
          </Left>
          <Right>
            <IntroRight />
          </Right>
        </>
      }
      case CREATE_ACCOUNT_STEP.NICKNAME: {
        return <>
          <Left>
            <LeftInner>
              <BreadCrumbs activeStep={curStep} />
              <StepNickNameLeft
                goNext={() => setCurSep(CREATE_ACCOUNT_STEP.ON_CHAIN)}
                goPrev={goPrev}
              />
            </LeftInner>
          </Left>
          <Right>
            <StepNickNameRight />
          </Right>
        </>
      }
      case CREATE_ACCOUNT_STEP.ON_CHAIN: {
        return <OnChain goNext={() => setCurSep(CREATE_ACCOUNT_STEP.DONE)} />
      }
      case CREATE_ACCOUNT_STEP.DONE: {
        return <>
          <Left>
            <LeftInner>
              <BreadCrumbs activeStep={curStep} />
              <CompleteLeft />
            </LeftInner>
          </Left>
          <Right>
            <CompleteRight />
          </Right>
        </>
      }
    }
  }, [curStep])

  if (!visible) return null;

  const windowTitle = curStep === CREATE_ACCOUNT_STEP.INTRO ? '注册账号' : '创建账号'

  return <div className={S.container}>
    <AppHeader isPopUp />
    <div className={S.layout}>
      <div className={S.bgWrap} />
      <CardWindow
        header={windowTitle}
        wrapClassName={S.window}
        headerClassName={S.windowHeader}
        showCloseButton
        onClose={closeRegisterPop}
      >
        <SetNickNameProvider>
          <DndContext>
            <div className={S.content}>
              {stepRender}
            </div>
            <DraggableOverlay />
          </DndContext>
        </SetNickNameProvider>
      </CardWindow>

      {/*<MultiDid />*/}

      {/*<Authorize />*/}
    </div>
  </div>
}

export function Left({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cx(S.left, className)}>
    {children}
  </div>
}

export function Right({ children }: { children: React.ReactNode }) {
  return <div className={S.right}>
    {children}
  </div>
}

export function LeftInner({ children }: { children: React.ReactNode }) {
  return <div className={S.leftInner}>
    {children}
  </div>
}