'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { KeystoreClient, KEY_STORE_URL } from '@/lib/keystore-client';

interface KeystoreContextType {
  client: KeystoreClient | null;
  connected: boolean;
  didKey: string | null;
  isLoading: boolean;
  error: string | null;
  openKeystore: () => void;
}

const KeystoreContext = createContext<KeystoreContextType | null>(null);

export function KeystoreProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<KeystoreClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [didKey, setDidKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const keystoreWindowRef = useRef<Window | null>(null);
  const connectIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const c = new KeystoreClient(KEY_STORE_URL);
    setClient(c);

    return () => {
      c.disconnect();
      if (connectIntervalRef.current) {
        clearInterval(connectIntervalRef.current);
      }
    };
  }, []);

  const tryConnect = useCallback(async (c: KeystoreClient) => {
    if (!c || connected || isLoading) return;
    
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
      
      if (connectIntervalRef.current) {
        clearInterval(connectIntervalRef.current);
        connectIntervalRef.current = null;
      }
    } catch (err: any) {
      console.log('Connection attempt failed:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [connected, isLoading]);

  const openKeystore = useCallback(() => {
    if (!client) return;
    
    const newWindow = window.open(KEY_STORE_URL, '_blank');
    if (!newWindow) {
      console.log('Failed to open keystore window. Please allow popups.');
      return;
    }
    
    keystoreWindowRef.current = newWindow;
    
    if (connectIntervalRef.current) {
      clearInterval(connectIntervalRef.current);
    }
    
    tryConnect(client);
    
    connectIntervalRef.current = setInterval(() => {
      if (newWindow.closed) {
        if (connectIntervalRef.current) {
          clearInterval(connectIntervalRef.current);
          connectIntervalRef.current = null;
        }
        return;
      }
      
      if (!connected && client) {
        tryConnect(client);
      }
    }, 2000);
  }, [client, connected, tryConnect]);

  useEffect(() => {
    if (!connected || !client) return;

    const checkConnection = async () => {
      try {
        await client.ping();
      } catch (err) {
        console.log('Keystore connection lost');
        setConnected(false);
        setDidKey(null);
      }
    };

    checkConnection();

    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, [connected, client]);

  return (
    <KeystoreContext.Provider value={{ client, connected, didKey, isLoading, error, openKeystore }}>
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
