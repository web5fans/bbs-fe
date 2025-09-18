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
import AppHeader from "@/app/@header/default";
import { useRegisterPopUp } from "@/provider/RegisterPopUpProvider";
import { LayoutCenter } from "@/components/Layout";
import ImportDid from "@/app/register-login/(components)/ImportDid";

export default function RegisterLogin() {
  const { visible, closeRegisterPop } = useRegisterPopUp()
  const [curStep, setCurSep] = useState<CREATE_ACCOUNT_STEP>(CREATE_ACCOUNT_STEP.INTRO)
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)

  const sensors = useSensors(mouseSensor, touchSensor)

  const [importDidInfo, setImportDidInfo] = useState<{ type: 'file' | 'scan' | '', visible: boolean }>({
    type: 'file',
    visible: false
  })


  const goPrev = () => {
    setCurSep(v => v - 1)
  }

  useEffect(() => {
    if (!visible) {
      setCurSep(CREATE_ACCOUNT_STEP.INTRO)
      setImportDidInfo({
        type: '',
        visible: false
      })
    }
  }, [visible]);

  const stepRender = useMemo(() => {
    switch (curStep) {
      case CREATE_ACCOUNT_STEP.INTRO: {
        return <IntroStep
          goNext={() => setCurSep(CREATE_ACCOUNT_STEP.NICKNAME)}
          showImport={type => setImportDidInfo({ type, visible: true })}
        />
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
    <AppHeader isPopUp />
    <div className={S.layout}>
        <div className={S.bgWrap} />
        <LayoutCenter style={{ overflow: 'initial' }}>

          {importDidInfo.visible && importDidInfo.type ? <ImportDid
              windowClassName={S.window}
              windowTitleClassName={S.windowHeader}
              importType={importDidInfo.type}
            /> : <CardWindow
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
          }

        </LayoutCenter>
      </div>
  </div>
}