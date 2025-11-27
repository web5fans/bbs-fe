'use client'

import React, { createContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { router } from "next/client";
import useRegisterPageStatus from "@/store/registerPageStatus";

type PopUpProviderProps = {
  visible: boolean
  openRegisterPop: () => void
  closeRegisterPop: () => void
}

const PopUpContext = createContext<PopUpProviderProps>({
  visible: false,
  openRegisterPop: () => {},
  closeRegisterPop: () => {},
})

export const RegisterPopUpProvider = (props: {
  children: React.ReactNode
}) => {
  const [visible, setVisible] = useState<boolean>(false)
  const pathname = usePathname()
  const { changeVisible } = useRegisterPageStatus()

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    changeVisible(visible)
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  useEffect(() => {
    setVisible(false)
  }, [pathname]);


  return <PopUpContext.Provider value={{
    visible,
    closeRegisterPop: () => setVisible(false),
    openRegisterPop: () => setVisible(true),
  }}>
    {props.children}
  </PopUpContext.Provider>
}

export function useRegisterPopUp() {
  const context = React.useContext(PopUpContext);

  return context;
}