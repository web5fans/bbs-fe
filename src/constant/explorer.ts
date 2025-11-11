import { IS_TESTNET } from "@/constant/Network";

export const CKB_EXPLORER = IS_TESTNET
  ? "https://testnet.explorer.nervos.org"
  : "https://explorer.nervos.org"