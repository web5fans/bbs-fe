declare module 'keystore/KeystoreClient' {
  export type BridgeRequest = {
    type: string;
    requestId: string;
    message?: Uint8Array;
    didKey?: string;
    signature?: Uint8Array;
  };

  export type BridgeResponse = {
    type: string;
    requestId: string;
    ok: boolean;
    error?: string;
    didKey?: string;
    verified?: boolean;
    signature?: Uint8Array;
  }

  export class KeystoreClient {
    constructor(bridgeUrl: string);
    connect(): Promise<void>;
    disconnect(): void;
    ping(): Promise<number>;
    getDIDKey(): Promise<string>;
    signMessage(message: Uint8Array): Promise<Uint8Array>;
    verifySignature(didKey: string, message: Uint8Array, signature: Uint8Array): Promise<boolean>;
  }
}

declare module 'keystore/constants' {
  export const KEY_STORE_URL: string;
  export const KEY_STORE_BRIDGE_URL: string;
}
