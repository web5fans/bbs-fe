'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { KeystoreClient, KEY_STORE_URL } from '@/lib/keystore-client';

interface KeystoreContextType {
  client: KeystoreClient | null;
  connected: boolean;
  didKey: string | null;
  isLoading: boolean;
  error: string | null;
  reconnect: () => Promise<void>;
}

const KeystoreContext = createContext<KeystoreContextType | null>(null);

export function KeystoreProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<KeystoreClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [didKey, setDidKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const c = new KeystoreClient(KEY_STORE_URL);
    setClient(c);

    return () => {
      c.disconnect();
    };
  }, []);

  const connect = useCallback(async (c: KeystoreClient) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await c.connect();
      setConnected(true);
      
      try {
        const key = await c.getDIDKey();
        if (key) {
          setDidKey(key);
        }
      } catch (err) {
        console.log('Failed to fetch DID on connect');
      }
    } catch (err: any) {
      console.log('Connection failed:', err.message);
      setError(err.message);
      setConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reconnect = useCallback(async () => {
    if (!client) return;
    
    setConnected(false);
    setDidKey(null);
    await connect(client);
  }, [client, connect]);

  useEffect(() => {
    if (client && !connected && !isLoading) {
      connect(client);
    }
  }, [client, connect, connected, isLoading]);

  return (
    <KeystoreContext.Provider value={{ client, connected, didKey, isLoading, error, reconnect }}>
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
