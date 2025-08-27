/* eslint-disable*/
"use client";

import { ccc } from "@ckb-ccc/connector-react";
import { CSSProperties } from "react";
import React from "react";
import { IS_TESTNET } from "@/constant/Network";
import { WalletProvider } from "@/provider/WalletProvider";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const defaultClient = React.useMemo(() => {
        return IS_TESTNET
            ? new ccc.ClientPublicTestnet()
            : new ccc.ClientPublicMainnet();
    }, []);

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
            clientOptions={[
                {
                    name: "CKB Testnet",
                    client: new ccc.ClientPublicTestnet(),
                },
                {
                    name: "CKB Mainnet",
                    client: new ccc.ClientPublicMainnet(),
                },
            ]}
        >
            <WalletProvider>
              {children}
            </WalletProvider>
        </ccc.Provider>
    );
}