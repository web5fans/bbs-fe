import { base32 } from "@scure/base";
import { hexToUint8Array } from "@/lib/dag-cbor";
import { randomBytes } from "crypto";
import { BigNumber } from "bignumber.js";

export function getCenterContentWidth(gridItemWidth: number = 88) {
  const docEl = document.documentElement;
  const clientWidth = window.innerWidth || docEl.getBoundingClientRect().width;
  const width = Math.min(clientWidth, 1440) - (35 * 2); // 左右margin最小36px
  const cols = Math.floor((width + 20) / (gridItemWidth + 20));

  const centerWidth = cols * gridItemWidth + (cols - 1) * 20

  return {
    centerWidth: Math.min(centerWidth, 1280),
    clientWidth
  }
}

export function generateDid(args: `0x${string}`) {
  const did = base32
    .encode(hexToUint8Array(args.slice(2, 42)))
    .toLowerCase()

  return `did:web5:${did}`
}

type Web3LoginMessage = {
  address: string
  domain: string
  nonce: string
  timestamp: number
  statement: string
  handle: string
}

export function generateWeb3LoginMessage(
  address: string,
  domain: string,
  handle: string
): Web3LoginMessage {
  const nonce = randomBytes(16).toString('hex')

  const timestamp = Math.floor(Date.now() / 1000)

  const message: Web3LoginMessage = {
    address: address.toLowerCase(),
    handle,
    domain,
    nonce,
    timestamp,
    statement: 'Sign this message to authenticate with our service.',
  }

  return message
}

export function formatMessageForSigning(message: Web3LoginMessage): string {
  return `Web3 Login\nDomain: ${message.domain}\nAddress: ${message.address}\nHandle: ${message.handle}\nNonce: ${message.nonce}\nTimestamp: ${message.timestamp}\nStatement: ${message.statement}`
}

export const shannonToCkb = (value: BigNumber | string | number): string => {
  if (!value) return "0";
  const bigValue =
    typeof value === "string" || typeof value === "number" || typeof value === "bigint"
      ? new BigNumber(value)
      : value;
  if (bigValue.isNaN()) {
    return "0";
  }
  const num = bigValue.dividedBy(new BigNumber("1e8"));
  if (num.abs().isLessThan(new BigNumber("1e-8"))) {
    return "0";
  }
  if (num.abs().isLessThan(new BigNumber("1e-6"))) {
    if (bigValue.mod(10).isEqualTo(0)) {
      return num.toFixed(7);
    }
    return num.toFixed(8);
  }
  return num.toString(); // `${}`
};