// Direct implementation of KeystoreClient without Module Federation
// This is a copy of the KeystoreClient from keystore module

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
};

export class KeystoreClient {
  private iframe: HTMLIFrameElement | null = null;
  private bridgeUrl: string;
  private pendingRequests: Map<string, { resolve: (value: any) => void; reject: (reason?: any) => void }> = new Map();

  constructor(bridgeUrl: string) {
    if (!bridgeUrl) {
      throw new Error("Bridge URL is required");
    }
    this.bridgeUrl = bridgeUrl;
  }

  connect(force: boolean = false): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.iframe && !force) {
        resolve();
        return;
      }

      // If forcing reconnect, clean up existing iframe
      if (this.iframe && force) {
        this.disconnect();
      }

      this.iframe = document.createElement("iframe");
      this.iframe.src = this.bridgeUrl;
      this.iframe.style.position = "absolute";
      this.iframe.style.width = "0";
      this.iframe.style.height = "0";
      this.iframe.style.border = "none";
      this.iframe.style.visibility = "hidden";

      window.addEventListener("message", this.handleMessage);

      const timeout = setTimeout(() => {
        reject(new Error("Iframe load timeout (5s)"));
      }, 5000);

      this.iframe.onload = async () => {
        clearTimeout(timeout);
        try {
          await new Promise((r) => setTimeout(r, 500));
          await this.ping();
          resolve();
        } catch (err) {
          console.warn("[KeystoreClient] First ping failed, retrying...", err);
          try {
            await new Promise((r) => setTimeout(r, 1000));
            await this.ping();
            resolve();
          } catch (err2) {
            reject(err2);
          }
        }
      };

      this.iframe.onerror = (err) => {
        clearTimeout(timeout);
        console.error("[KeystoreClient] Iframe load error", err);
        reject(new Error("Failed to load bridge iframe"));
      };

      document.body.appendChild(this.iframe);
    });
  }

  disconnect(): void {
    if (this.iframe) {
      document.body.removeChild(this.iframe);
      this.iframe = null;
    }
    window.removeEventListener("message", this.handleMessage);
    this.pendingRequests.clear();
  }

  private handleMessage = (event: MessageEvent) => {
    const { data } = event;
    if (!data || !data.requestId) return;

    const pending = this.pendingRequests.get(data.requestId);
    if (pending) {
      this.pendingRequests.delete(data.requestId);
      if (data.ok === false) {
        pending.reject(new Error(data.error || "Unknown bridge error"));
      } else {
        pending.resolve(data);
      }
    }
  };

  private request(data: BridgeRequest): Promise<BridgeResponse> {
    if (!this.iframe || !this.iframe.contentWindow) {
      return Promise.reject(new Error("Bridge not connected"));
    }

    const requestId = data.requestId;
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });
      this.iframe!.contentWindow!.postMessage(data, "*");
      
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error(`Request ${data.type} timed out`));
        }
      }, 30000);
    });
  }

  async ping(): Promise<number> {
    const start = performance.now();
    const response = await this.request({
      type: "PING",
      requestId: crypto.randomUUID(),
    });
    if (!response.ok) {
      throw new Error("Ping failed");
    }
    if (response.type !== "PONG") {
      throw new Error("Invalid response type");
    }
    return performance.now() - start;
  }

  async getDIDKey(): Promise<string> {
    const response = await this.request({
      type: "GET_DID_KEY",
      requestId: crypto.randomUUID(),
    });
    if (!response.ok) {
      throw new Error(response.error || "Failed to get DID key");
    }
    if (!response.didKey) {
      throw new Error("No DID key returned");
    }
    return response.didKey;
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    const response = await this.request({
      type: "SIGN_MESSAGE",
      requestId: crypto.randomUUID(),
      message,
    });
    if (!response.ok) {
      throw new Error(response.error || "Failed to sign message");
    }
    if (!response.signature) {
      throw new Error("No signature returned");
    }
    return response.signature;
  }

  async verifySignature(
    didKey: string,
    message: Uint8Array,
    signature: Uint8Array
  ): Promise<boolean> {
    const response = await this.request({
      type: "VERIFY_SIGNATURE",
      requestId: crypto.randomUUID(),
      didKey,
      message,
      signature,
    });
    if (!response.ok) {
      throw new Error(response.error || "Failed to verify signature");
    }
    return response.verified === true;
  }
}

export const KEY_STORE_URL = process.env.NODE_ENV === "production"
  ? "https://keystore.web5.fans"
  : "http://localhost:3001";

export const KEY_STORE_BRIDGE_URL = `${KEY_STORE_URL}/bridge.html`;
