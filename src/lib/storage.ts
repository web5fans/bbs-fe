const ACCESS_TOKEN_STORE_KEY = '@bbs:client';

export type TokenStorageType = {
  did: string
  walletAddress: string
  signKey: string
}

const clientRun = <T extends (...args: any[]) => any>(f: T) => {
  if (typeof window !== 'undefined') {
    return f;
  }
  return (() => {}) as unknown as T;
}

const storage = {
  getItem: clientRun((key: string) => {
    return window.localStorage.getItem(key);
  }),
  setItem: clientRun((key: string, value: string) => {
    return window.localStorage.setItem(key, value);
  }),
  removeItem: clientRun((key: string, value: string) => {
    return window.localStorage.setItem(key, value);
  }),
  clear: clientRun(() => {
    return window.localStorage.clear();
  }),
  setToken: clientRun((accTokenVal: TokenStorageType) => {
    window.localStorage.setItem(ACCESS_TOKEN_STORE_KEY, JSON.stringify(accTokenVal));
  }),
  getToken: clientRun(() => {
    const res =  window.localStorage.getItem(ACCESS_TOKEN_STORE_KEY)
    return res ? JSON.parse(res) as TokenStorageType : null;
  }),
  removeToken: clientRun(() => {
    return window.localStorage.removeItem(ACCESS_TOKEN_STORE_KEY);
  }),
}

export default storage;