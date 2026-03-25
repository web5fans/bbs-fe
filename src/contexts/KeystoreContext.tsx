'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// KeystoreClient interface
type KeystoreClientType = {
  connect(): Promise<void>;
  disconnect(): void;
  ping(): Promise<number>;
  getDIDKey(): Promise<string>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  verifySignature(didKey: string, message: Uint8Array, signature: Uint8Array): Promise<boolean>;
};

interface KeystoreContextType {
  client: KeystoreClientType | null;
  connected: boolean;
  didKey: string | null;
  isLoading: boolean;
  error: string | null;
}

const KeystoreContext = createContext<KeystoreContextType | null>(null);

const IS_PROD = process.env.NODE_ENV === "production";
const KEYSTORE_URL = IS_PROD 
  ? 'https://keystore.web5.fans'
  : 'http://localhost:3001';
const KEY_STORE_BRIDGE_URL = `${KEYSTORE_URL}/bridge.html`;

export function KeystoreProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<KeystoreClientType | null>(null);
  const [connected, setConnected] = useState(false);
  const [didKey, setDidKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initKeystore = async () => {
      try {
        // Use dynamic import to load the ESM module
        const remoteUrl = `${KEYSTORE_URL}/assets/remoteEntry.js`;
        
        // Create a module script element to properly load ESM
        const moduleScript = await loadModuleScript(remoteUrl);
        
        // The remote module should expose its API to window
        // Give it a moment to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Try to get KeystoreClient from window.keystore or window
        const KeystoreClient = 
          (window as any).keystore?.KeystoreClient || 
          (window as any).KeystoreClient;
        
        if (!KeystoreClient) {
          throw new Error('KeystoreClient not found. Make sure the keystore remote is properly loaded.');
        }

        const c = new KeystoreClient(KEY_STORE_BRIDGE_URL);
        setClient(c);
        
        await c.connect();
        setConnected(true);
        
        try {
          const key = await c.getDIDKey();
          setDidKey(key);
        } catch (err) {
          console.log('No active key in keystore');
        }
      } catch (err) {
        console.error('Keystore initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect keystore');
      } finally {
        setIsLoading(false);
      }
    };

    initKeystore();

    return () => {
      client?.disconnect();
    };
  }, []);

  return (
    <KeystoreContext.Provider value={{ client, connected, didKey, isLoading, error }}>
      {children}
    </KeystoreContext.Provider>
  );
}

export function useKeystore() {
  const context = useContext(KeystoreContext);
  if (!context) {
    throw new Error('useKeystore must be used within KeystoreProvider');
  }
  return context;
}

// Helper function to load module script (ESM)
function loadModuleScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.type = 'module'; // Important: load as ES module
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    
    document.head.appendChild(script);
  });
}
