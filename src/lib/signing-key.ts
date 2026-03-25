import storage from "@/lib/storage";
import dayjs from "dayjs";
import * as cbor from "@ipld/dag-cbor";
import { uint8ArrayToHex } from "@/lib/dag-cbor";
import type { KeystoreClient } from "keystore/KeystoreClient";

export interface SigningKeyInfoParams {
  client: KeystoreClient;
  didKey: string;
  params?: Record<string, any>;
}

export default async function getSigningKeyInfo({ client, didKey, params }: SigningKeyInfoParams) {
  const tokenInfo = storage.getToken();
  if (!tokenInfo?.did) {
    throw new Error('User not logged in');
  }

  let signed_bytes;
  let format_params;

  if (params) {
    const paramsObj = {
      ...params,
      timestamp: dayjs().utc().unix()
    };

    const encoded = cbor.encode(paramsObj);
    const sig = await client.signMessage(encoded);

    signed_bytes = uint8ArrayToHex(sig);
    format_params = paramsObj;
  }

  return {
    did: tokenInfo.did,
    signing_key_did: didKey,
    signed_bytes,
    format_params
  };
}
