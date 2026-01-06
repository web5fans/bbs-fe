import server from "@/server";
import getPDSClient from "@/lib/pdsClient";
import storage from "@/lib/storage";
import * as crypto from '@atproto/crypto'
import { signCommit, UnsignedCommit } from '@atproto/repo'
import { uint8ArrayToHex } from "@/lib/dag-cbor";
import { CID } from 'multiformats/cid'
import * as cbor from '@ipld/dag-cbor'
import { TID } from '@atproto/common-web'
import dayjs from "dayjs";
import { showGlobalToast } from "@/provider/toast";
import { Secp256k1Keypair } from "@atproto/crypto";
import sessionWrapApi from "@/lib/wrapApiAutoSession";

export type PostFeedItemType = {
  uri: string,
  cid: string,
  author: { displayName: string, [key: string]: string },
  title: string,
  text: string,
  visited_count: string,
  comment_count: string,
  like_count: string,
  visited: string, // 时间
  updated: string, // 时间
  created: string, // 时间
  section: string,       // 版区名称
  section_id: string,
  is_top: boolean
  is_announcement: boolean
  is_disabled: boolean
  is_draft: boolean
  reasons_for_disabled?: string
}

export type SectionItem = {
  post_count: string
  comment_count: string
  announcement_count: string
  top_count: string
  ckb_addr: string
  id: string;
  name: string
  owner?: { did: string; displayName?: string } // 版主
  description?: string // 描述
  administrators: {did: string; [key: string]: any}[]  // 管理员列表
  is_disabled?: boolean
  owner_set_time: string | null
  image: string | null
}

/* 获取版区列表 */
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
  is_draft?: boolean // 是否是草稿
} | {
  $type: 'app.bbs.comment'
  post: string  // 原帖uri
  text: string;
  section_id: string;
} | {
  $type: 'app.actor.profile'
  displayName: string;
  handle: string;
  [key: string]: any;
} | {
  $type: 'app.bbs.like'
  to: string; // 点赞的帖子uri或者评论\回复的uri
  section_id: string;
} | {
  $type: 'app.bbs.reply'
  post: string    // 帖子的uri
  comment?: string   // 跟帖的uri
  to?: string   // 对方did, 有就填，没有就是直接回复评论的
  text: string
  section_id: string
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

/* 发帖、回帖、点赞、编辑帖子PDS写入操作 */
export async function postsWritesPDSOperation(params: {
  record: PostRecordType
  did: string
  rkey?: string
  type?: 'update' | 'create' | 'delete'
}) {
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

  if (!storageInfo?.signKey) {
    throw '没缓存'
  }

  let keyPair = await crypto.Secp256k1Keypair.import(storageInfo?.signKey?.slice(2))

  let uncommit: UnsignedCommit = {
    did: writerData.did,
    version: 3,
    rev: writerData.rev,
    prev: writerData.prev ?? null,
    data: CID.parse(writerData.data),
  }
  const preEncoded = cbor.encode(uncommit)

  if (uint8ArrayToHex(preEncoded) !== writerData.unSignBytes) {
    throw 'sign bytes not consistent'
  }

  const encoded = cbor.encode(uncommit)
  const sig = await keyPair.sign(encoded)
  const commit =  {
    ...uncommit,
    sig,
  }
  let signingKey = keyPair.did()

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

  let requestUrl = ''

  switch (operateType) {
    case "create":
      requestUrl = '/record/create'
      break;
    case "update":
      requestUrl = '/record/update'
      break;
    case "delete":
      requestUrl = '/record/delete'
      break
  }
  
  const res = await server<CreatePostResponse>(requestUrl, 'POST', serverParams)

  return {
    uri: res?.results?.[0].uri,
    created: newRecord.created
  }
}

export type PostOptParamsType = {
  nsid: 'app.bbs.post' | 'app.bbs.comment' | 'app.bbs.reply'
  uri: string
  is_top?: boolean
  is_announcement?: boolean
} & ({ is_disabled: true; reasons_for_disabled: string } | { is_disabled?: boolean; reasons_for_disabled?: string })

export async function updatePostByAdmin(params: PostOptParamsType): Promise<void> {
  const storageInfo = storage.getToken()

  if (!storageInfo?.signKey) return

  const { signKey, did } = storageInfo

  const keyPair = await Secp256k1Keypair.import(signKey?.slice(2))

  const signingKey = keyPair.did()

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
  const sig = await keyPair.sign(encoded)

  await server('/admin/update_tag', 'POST', {
    did,
    signing_key_did: signingKey,
    params: paramsObj,
    signed_bytes: uint8ArrayToHex(sig),
  })
}