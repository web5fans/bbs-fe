'use client'

import S from './index.module.scss'
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { DraggableOverlay } from "./(components)/ComputerCard/DraggableOverlay";
import { useEffect, useMemo, useState } from "react";
import CardWindow from "@/components/CardWindow";
import { CREATE_ACCOUNT_STEP } from "./(components)/BreadCrumbs";
import { SetNickNameProvider } from "@/provider/RegisterNickNameProvider";
import NickNameStep from "./(components)/Steps/NickName";
import OnChain from "@/app/register-login/(components)/Steps/OnChain";
import IntroStep from "@/app/register-login/(components)/Steps/Intro";
import CompleteStep from './(components)/Steps/Complete';
import MultiDid from "@/app/register-login/(components)/MultiDid";
import Authorize from "@/app/register-login/(components)/Authorize";
import AppHeader from "@/app/@header/default";
import { useRegisterPopUp } from "@/provider/RegisterPopUpProvider";
import cx from "classnames";
import { LayoutCenter } from "@/components/Layout";

export default function RegisterLogin() {
  const { visible, closeRegisterPop } = useRegisterPopUp()
  const [curStep, setCurSep] = useState<CREATE_ACCOUNT_STEP>(CREATE_ACCOUNT_STEP.INTRO)
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)

  const sensors = useSensors(mouseSensor, touchSensor)


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
        return <IntroStep goNext={() => setCurSep(CREATE_ACCOUNT_STEP.NICKNAME)} />
      }
      case CREATE_ACCOUNT_STEP.NICKNAME: {
        return <>
          <NickNameStep goNext={() => setCurSep(CREATE_ACCOUNT_STEP.ON_CHAIN)} goPrevious={goPrev} />
        </>
      }
      case CREATE_ACCOUNT_STEP.ON_CHAIN: {
        return <OnChain goNext={() => setCurSep(CREATE_ACCOUNT_STEP.DONE)} />
      }
      case CREATE_ACCOUNT_STEP.DONE: {
        return <CompleteStep />
      }
    }
  }, [curStep])

  if (!visible) return null;

  const windowTitle = curStep === CREATE_ACCOUNT_STEP.INTRO ? '注册账号' : '创建账号'

  return <div className={S.container}>
    <div className={'w-full min-w-fit'}>
      <AppHeader isPopUp />
      <div className={S.layout}>
        <div className={S.bgWrap} />
        <LayoutCenter style={{ overflow: 'initial' }}>
          <CardWindow
            header={windowTitle}
            wrapClassName={S.window}
            headerClassName={S.windowHeader}
            showCloseButton
            onClose={closeRegisterPop}
          >
            <SetNickNameProvider>
              <DndContext sensors={sensors}>
                <div className={S.content}>
                  {stepRender}
                </div>
                <DraggableOverlay />
              </DndContext>
            </SetNickNameProvider>
          </CardWindow>
        </LayoutCenter>

        {/*<MultiDid />*/}

        {/*<Authorize />*/}
      </div>
    </div>
  </div>
}