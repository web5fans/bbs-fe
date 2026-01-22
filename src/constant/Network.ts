import { env } from 'next-runtime-env'

export type NEXTWORK_ENUM = 'testnet' | 'mainnet'

export const NETWORK = env("NEXT_PUBLIC_CHAIN_NETWORK") as NEXTWORK_ENUM;
if (!NETWORK) {
  console.error('env network not detected:', NETWORK);
}

export function withNetwork<T>(config: Record<NEXTWORK_ENUM, T>) {
  return config[NETWORK]
}

export const IS_TESTNET = NETWORK === 'testnet'

export const IS_MAINNET = NETWORK === 'mainnet'

export const PDS_API_URL = env("NEXT_PUBLIC_PDS_SERVICE") as string

export const USER_DOMAIN = env("NEXT_PUBLIC_USER_DOMAIN") as string

export const DID_INDEXER = env("NEXT_PUBLIC_DID_INDEXER") as string

export const DID_PREFIX = env("NEXT_PUBLIC_DID_PREFIX") as string || 'did:ckb:'
