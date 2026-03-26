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

type PendingRequest = {
  requestId: string;
  resolve: (val: BridgeResponse) => void;
  reject: (err: Error) => void;
  timeoutId: number;
};

function bytesToHex(bytes: Uint8Array): string {
  const hex: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    const current = bytes[i] < 16 ? '0' + bytes[i].toString(16) : bytes[i].toString(16);
    hex.push(current);
  }
  return hex.join('');
}

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error('hex string length must be even');
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export class KeystoreClient {
  private keystoreUrl: string;
  private pendingRequest: PendingRequest | null = null;
  private isConnected = false;
  private messageHandler: (event: MessageEvent) => void;
  private keystoreWindow: Window | null = null;

  constructor(keystoreUrl: string) {
    if (!keystoreUrl) {
      throw new Error('Keystore URL is required');
    }
    this.keystoreUrl = keystoreUrl;

    this.messageHandler = this.handleMessage.bind(this);
    window.addEventListener('message', this.messageHandler);
  }

  public openTab(): Window | null {
    if (this.keystoreWindow && !this.keystoreWindow.closed) {
      this.keystoreWindow.focus();
      return this.keystoreWindow;
    }
    
    this.keystoreWindow = window.open(this.keystoreUrl, '_blank');
    
    if (this.keystoreWindow) {
      setTimeout(() => {
        window.focus();
      }, 100);
    }
    
    return this.keystoreWindow;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve();
        return;
      }

      this.sendRequest({ type: 'PING', requestId: crypto.randomUUID() })
        .then(() => {
          this.isConnected = true;
          resolve();
        })
        .catch(reject);
    });
  }

  public disconnect() {
    this.pendingRequest = null;
    this.isConnected = false;
    window.removeEventListener('message', this.messageHandler);
  }

  private handleMessage(event: MessageEvent) {
    const { data } = event;
    if (!data || typeof data !== 'object') return;
    if (data.source !== 'keystore-auth') return;
    if (data.type === 'ready') return;

    if (!this.pendingRequest) return;
    if (data.requestId !== this.pendingRequest.requestId) return;

    const pending = this.pendingRequest;
    this.pendingRequest = null;
    clearTimeout(pending.timeoutId);

    if (data.ok) {
      pending.resolve({
        type: data.type || 'response',
        requestId: data.requestId,
        ok: true,
        didKey: data.didKey,
        verified: data.verified,
        signature: data.signature ? hexToBytes(data.signature) : undefined,
      });
    } else {
      pending.reject(new Error(data.error || 'Unknown error'));
    }
  }

  private sendRequest(request: BridgeRequest): Promise<BridgeResponse> {
    return new Promise((resolve, reject) => {
      if (this.pendingRequest) {
        reject(new Error('Another request is already pending'));
        return;
      }

      const requestId = request.requestId;

      const timeoutId = window.setTimeout(() => {
        if (this.pendingRequest?.requestId === requestId) {
          this.pendingRequest = null;
          reject(new Error(`Request ${request.type} timed out after 30s`));
        }
      }, 30000);

      this.pendingRequest = {
        requestId,
        resolve,
        reject,
        timeoutId,
      };

      const origin = window.location.origin;

      const messageData = {
        source: 'keystore-client',
        origin,
        type: request.type,
        requestId,
        message: request.message ? bytesToHex(request.message) : undefined,
        didKey: request.didKey,
        signature: request.signature ? bytesToHex(request.signature) : undefined,
      };

      if (this.keystoreWindow && !this.keystoreWindow.closed) {
        this.keystoreWindow.postMessage(messageData, this.keystoreUrl);
      } else {
        this.keystoreWindow = window.open(this.keystoreUrl, '_blank');

        if (!this.keystoreWindow) {
          this.pendingRequest = null;
          reject(new Error('Failed to open keystore tab. Please allow popups for this site.'));
          return;
        }

        setTimeout(() => {
          window.focus();
        }, 100);

        const checkReady = setInterval(() => {
          if (!this.keystoreWindow || this.keystoreWindow.closed) {
            clearInterval(checkReady);
            return;
          }
          this.keystoreWindow.postMessage(messageData, this.keystoreUrl);
        }, 100);

        setTimeout(() => {
          clearInterval(checkReady);
        }, 5000);
      }
    });
  }

  public async ping(): Promise<number> {
    const start = performance.now();
    const res = await this.sendRequest({
      type: 'PING',
      requestId: crypto.randomUUID(),
    });
    if (!res.ok) {
      throw new Error('Ping failed');
    }
    return performance.now() - start;
  }

  public async getDIDKey(): Promise<string> {
    const res = await this.sendRequest({
      type: 'getDIDKey',
      requestId: crypto.randomUUID(),
    });
    if (!res.ok) {
      throw new Error('Failed to get DID key');
    }
    if (typeof res.didKey !== 'string') {
      throw new Error('Invalid DID key format');
    }
    return res.didKey;
  }

  public async signMessage(message: Uint8Array): Promise<Uint8Array> {
    const res = await this.sendRequest({
      type: 'signMessage',
      requestId: crypto.randomUUID(),
      message,
    });
    if (!res.ok) {
      throw new Error('Failed to sign message');
    }
    if (!res.signature || !(res.signature instanceof Uint8Array)) {
      throw new Error('Invalid signature format');
    }
    return res.signature;
  }

  public async verifySignature(didKey: string, message: Uint8Array, signature: Uint8Array): Promise<boolean> {
    const res = await this.sendRequest({
      type: 'verifySignature',
      requestId: crypto.randomUUID(),
      didKey,
      message,
      signature,
    });
    if (!res.ok) {
      throw new Error('Failed to verify signature');
    }
    if (typeof res.verified !== 'boolean') {
      throw new Error('Invalid verification result format');
    }
    return res.verified;
  }
}

export const KEY_STORE_URL = process.env.NODE_ENV === 'production'
  ? 'https://keystore.web5.fans'
  : 'http://localhost:3001';

export const KEY_STORE_BRIDGE_URL = `${KEY_STORE_URL}/bridge.html`;
