import storage from "@/lib/storage";
import { Secp256k1Keypair } from "@atproto/crypto";
import dayjs from "dayjs";
import * as cbor from "@ipld/dag-cbor";
import { uint8ArrayToHex } from "@/lib/dag-cbor";

export default async function getSigningKeyInfo(params?: Record<string, any>) {
  const storageInfo = storage.getToken()

  if (!storageInfo?.signKey) return

  const { signKey, did } = storageInfo

  const keyPair = await Secp256k1Keypair.import(signKey?.slice(2))

  const signingKey = keyPair.did()

  let signed_bytes;
  let format_params;

  if (params) {
    const paramsObj = {
      ...params,
      timestamp: dayjs().utc().unix()
    }

    const encoded = cbor.encode(paramsObj)
    const sig = await keyPair.sign(encoded)

    signed_bytes = uint8ArrayToHex(sig)
    format_params = paramsObj
  }

  return {
    did,
    signing_key_did: signingKey,
    keyPair,
    signed_bytes,
    format_params
  }
}