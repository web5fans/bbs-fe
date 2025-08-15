"use client";

import { ccc } from "@ckb-ccc/connector-react";
import React, { createContext, ReactNode, useEffect, useMemo, useState } from "react";

export const APP_CONTEXT = createContext<
  | {
      address: string;
      isConnected: boolean;
      signer?: ccc.Signer;
      walletClient?: ccc.Client;
      openSigner: () => void;
      disconnect: () => Promise<void>;
    }
  | undefined
>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);

  const {
    wallet,
    signerInfo: cccSigner,
    open,
    client,
    disconnect,
  } = ccc.useCcc();
  const signer = cccSigner?.signer;

  const getSignerInfo = async () => {
    const fromAddress = await signer?.getAddresses()
    setAddress(fromAddress?.[0] || '')

    const connect = await signer?.isConnected();
    setIsConnected(connect ?? false);
  }

  useEffect(() => {
    getSignerInfo()
  }, [signer]);

  return (
    <APP_CONTEXT.Provider
      value={{
        address,
        signer,
        isConnected,
        walletClient: client,
        openSigner: () => {
          open()
        },
        disconnect: async () => {
          await signer?.disconnect();
          if (cccSigner) {
            disconnect();
          }
          setIsConnected(false)
          setAddress('');
        },
      }}
    >
      {children}
    </APP_CONTEXT.Provider>
  );
}

export function useWallet() {
  const context = React.useContext(APP_CONTEXT);
  if (!context) {
    throw Error(
      "The component which invokes the useApp hook should be placed in a AppProvider.",
    );
  }
  return context;
}
