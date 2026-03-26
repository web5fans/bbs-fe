import server from "@/server";
import getPDSClient from "@/lib/pdsClient";
import storage from "@/lib/storage";
import { UnsignedCommit } from '@atproto/repo'
import { uint8ArrayToHex } from "@/lib/dag-cbor";
import { CID } from 'multiformats/cid'
import * as cbor from '@ipld/dag-cbor'
import { TID } from '@atproto/common-web'
import dayjs from "dayjs";
import sessionWrapApi from "@/lib/wrapApiAutoSession";
import { UserProfileType } from "@/store/userInfo";
import type { KeystoreClient } from "@/lib/keystore-client";

export type PostFeedItemType = {
  uri: string,
  cid: string,
  author: UserProfileType,
  title: string,
  text: string,
  visited_count: string,
  comment_count: string,
  like_count: string,
  tip_count: string,
  reply_count?: string,
  post?: string,
  visited: string,
  updated: string,
  created: string,
  section: string,
  section_id: string,
  is_top: boolean
  is_announcement: boolean
  is_disabled: boolean
  is_draft: boolean
  reasons_for_disabled?: string
  edited?: string
}

export type CommentOrReplyItemType = {
  uri: string,
  cid: string,
  author: UserProfileType,
  to?: UserProfileType,
  text: string,
  like_count: string,
  liked?: boolean
  tip_count: string,
  reply_count?: string,
  post: string,
  updated?: string,
  created: string,
  is_disabled: boolean
  reasons_for_disabled?: string
  edited?: string
  comment?: string
}

export type CommentAllPostType = PostFeedItemType & {
  comment_uri: string
  comment_text: string
  comment_created: string
  comment_reasons_for_disabled: string | null
  comment_disabled: boolean | null
  comment_updated?: string
}

export type SectionItem = {
  post_count: string
  comment_count: string
  announcement_count: string
  top_count: string
  ckb_addr: string
  id: string;
  name: string
  owner?: { did: string; displayName?: string }
  description?: string
  administrators: {did: string; [key: string]: any}[]
  is_disabled?: boolean
  owner_set_time: string | null
  image: string | null
}

export async function getSectionList(did?: string) {
  return await server<SectionItem[]>('/section/list', 'GET', {
    repo: did,
    is_disabled: false
  })
}

type PostRecordType = {
  $type: 'app.bbs.post'
  section_id: string;
  title: string;
  text: string;
  edited?: string
  created?: string
  is_draft?: boolean
  is_announcement?: boolean
} | {
  $type: 'app.bbs.comment'
  post: string
  text: string;
  section_id: string;
  edited?: string
} | {
  $type: 'app.actor.profile'
  displayName: string;
  handle: string;
  [key: string]: any;
} | {
  $type: 'app.bbs.like'
  to: string;
  section_id: string;
} | {
  $type: 'app.bbs.reply'
  post: string
  comment?: string
  to?: string
  text: string
  section_id: string
  edited?: string
}

type CreatePostResponse = {
  commit?: {
    cid: string
    rev: string
  },
  results?: {
    $type: "fans.web5.ckb.directWrites#createResult"
    cid: string
    uri: string
  }[]
}

export type WritePDSOptParamsType = {
  record: PostRecordType
  did: string
  rkey?: string
  type?: 'update' | 'create' | 'delete'
  client: KeystoreClient;
  didKey: string;
}

export async function postsWritesPDSOperation(params: WritePDSOptParamsType) {
  const { client, didKey } = params
  const operateType = params.type || 'create'
  const pdsClient = getPDSClient()

  const rkey = params.rkey || TID.next().toString()

  const newRecord = {
    created: dayjs.utc().format(),
    ...params.record,
  }

  const $typeMap = {
    create: "fans.web5.ckb.preDirectWrites#create",
    update: "fans.web5.ckb.preDirectWrites#update",
    delete: "fans.web5.ckb.preDirectWrites#delete",
  } as const

  const writeRes = await sessionWrapApi(() => pdsClient.fans.web5.ckb.preDirectWrites({
    repo: params.did,
    writes: [{
      $type: $typeMap[operateType],
      collection: newRecord.$type,
      rkey,
      value: newRecord
    }],
    validate: false,
  }))

  const writerData = writeRes.data

  const storageInfo = storage.getToken()

  if (!storageInfo?.signingKeyDid) {
    throw new Error('No signing key available')
  }

  let uncommit: UnsignedCommit = {
    did: writerData.did,
    version: 3,
    rev: writerData.rev,
    prev: writerData.prev ?? null,
    data: CID.parse(writerData.data),
  }
  const preEncoded = cbor.encode(uncommit)

  if (uint8ArrayToHex(preEncoded) !== writerData.unSignBytes) {
    throw new Error('sign bytes not consistent')
  }

  const encoded = cbor.encode(uncommit)
  const sig = await client.signMessage(encoded)
  const commit = {
    ...uncommit,
    sig,
  }
  let signingKey = didKey

  const localStorage = storage.getToken()

  const serverParams = {
    repo: params.did,
    rkey,
    value: newRecord,
    signing_key: signingKey,
    ckb_addr: localStorage?.walletAddress,
    root: {
      did: writerData.did,
      version: 3,
      rev: writerData.rev,
      prev: writerData.prev,
      data: writerData.data,
      signedBytes: uint8ArrayToHex(commit.sig),
    },
  }

  const directWriteTypeMap = {
    create: "fans.web5.ckb.directWrites#create",
    update: "fans.web5.ckb.directWrites#update",
    delete: "fans.web5.ckb.directWrites#delete",
  } as const

  const result = await sessionWrapApi(() => pdsClient.fans.web5.ckb.directWrites({
    repo: serverParams.repo,
    writes: [{
      $type: directWriteTypeMap[operateType],
      collection: newRecord.$type,
      rkey: serverParams.rkey,
      value: serverParams.value
    }],
    validate: false,
    signingKey: serverParams.signing_key,
    root: serverParams.root,
    ckbAddr: serverParams.ckb_addr
  }))

  const resultsNew = result.data.results?.[0]
  return {
    uri: resultsNew?.uri,
    created: newRecord.created,
    cid: resultsNew?.cid,
  }
}

export type PostOptParamsType = {
  uri: string
  is_top?: boolean
  is_announcement?: boolean
  client: KeystoreClient;
  didKey: string;
} & ({ is_disabled: true; reasons_for_disabled: string } | { is_disabled?: boolean; reasons_for_disabled?: string })

export async function updatePostByAdmin(params: PostOptParamsType): Promise<void> {
  const { client, didKey } = params
  const storageInfo = storage.getToken()

  if (!storageInfo?.signingKeyDid) {
    throw new Error('No signing key available')
  }

  const { did } = storageInfo

  const signingKey = didKey

  const paramsObj = {
    ...params,
    timestamp: dayjs().utc().unix()
  }

  const encoded = cbor.encode({
    is_top: null,
    is_announcement: null,
    is_disabled: null,
    ...paramsObj,
    reasons_for_disabled: params.reasons_for_disabled || null,
  })
  const sig = await client.signMessage(encoded)

  await server('/admin/update_tag', 'POST', {
    did,
    signing_key_did: signingKey,
    params: paramsObj,
    signed_bytes: uint8ArrayToHex(sig),
  })
}
