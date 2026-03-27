'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { KeystoreClient, KEY_STORE_URL } from '@/lib/keystore-client';

interface KeystoreContextType {
  client: KeystoreClient | null;
  connected: boolean;
  didKey: string | null;
  connect: () => Promise<void>;
  isConnecting: boolean;
}

const KeystoreContext = createContext<KeystoreContextType | null>(null);

export function KeystoreProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<KeystoreClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [didKey, setDidKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const c = new KeystoreClient(KEY_STORE_URL);
    setClient(c);

    return () => {
      c.disconnect();
      setConnected(false);
      setDidKey(null);
    };
  }, []);

  const connect = useCallback(async () => {
    if (!client || isConnecting || connected) return;

    setIsConnecting(true);

    try {
      await client.connect();
      setConnected(true);

      try {
        const did = await client.getDIDKey();
        if (did) {
          setDidKey(did);
        }
      } catch (err) {
        console.log('Failed to fetch DID on connect');
      }
    } catch (err) {
      console.error('Failed to connect to Keystore:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [client, isConnecting, connected]);

  return (
    <KeystoreContext.Provider value={{ client, connected, didKey, connect, isConnecting }}>
      {children}
    </KeystoreContext.Provider>
  );
}

export function useKeystore() {
  const context = useContext(KeystoreContext);
  if (!context) {
    throw new Error('useKeystore must be used within a KeystoreProvider');
  }
  return context;
}
