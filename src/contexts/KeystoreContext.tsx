'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { KeystoreClient } from 'keystore/KeystoreClient';
import { KEY_STORE_BRIDGE_URL } from 'keystore/constants';

interface KeystoreContextType {
  client: KeystoreClient | null;
  connected: boolean;
  didKey: string | null;
  isLoading: boolean;
  error: string | null;
}

const KeystoreContext = createContext<KeystoreContextType | null>(null);

export function KeystoreProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<KeystoreClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [didKey, setDidKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initKeystore = async () => {
      try {
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
