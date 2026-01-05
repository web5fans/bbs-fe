/* eslint-disable*/
"use client";

import { ccc } from "@ckb-ccc/connector-react";
import { CSSProperties, useEffect, useState } from "react";
import React from "react";
import { IS_TESTNET } from "@/constant/Network";
import { WalletProvider } from "@/provider/WalletProvider";
import { ensureSuperise, isSuperiseEnv } from "@/lib/ensureSuperise";
import { SuperiseSignersController } from "./CustomSignersController";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [ signersController, setSignersController ] = useState<ccc.SignersController | undefined>(undefined)

  const defaultClient = React.useMemo(() => {
    return IS_TESTNET
      ? new ccc.ClientPublicTestnet()
      : new ccc.ClientPublicMainnet();
  }, []);

  useEffect(() => {
    if (isSuperiseEnv) {
      ensureSuperise().then(() => setSignersController(new SuperiseSignersController()))
    }
  }, [])

  if (isSuperiseEnv && !signersController) {
    return <div />
  }

  return (
    <ccc.Provider
      connectorProps={{
        style: {
          // fontSize: '12px !important'
          // "--background": "#232323",
          // "--divider": "rgba(255, 255, 255, 0.1)",
          // "--btn-primary": "#2D2F2F",
          // "--btn-primary-hover": "#515151",
          // "--btn-secondary": "#2D2F2F",
          // "--btn-secondary-hover": "#515151",
          // "--icon-primary": "#FFFFFF",
          // "--icon-secondary": "rgba(255, 255, 255, 0.6)",
          // color: "#ffffff",
          // "--tip-color": "#666",
        } as CSSProperties,
      }}
      defaultClient={defaultClient}
      // clientOptions={[
      //   {
      //     name: "CKB Testnet",
      //     client: new ccc.ClientPublicTestnet(),
      //   },
      //   {
      //     name: "CKB Mainnet",
      //     client: new ccc.ClientPublicMainnet(),
      //   },
      // ]}
      signersController={signersController}
    >
      <WalletProvider>
        {children}
      </WalletProvider>
    </ccc.Provider>
  );
}