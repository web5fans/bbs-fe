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
}

export type SectionItem = {
  post_count: string
  comment_count: string
  id: string;
  name: string
  owner?: { did: string; displayName?: string } // 版主
  description?: string // 描述
  administrators?: any[]  // 管理员列表
}

/* 获取版区列表 */
export async function getSectionList(did?: string) {
  return await server<SectionItem[]>('/section/list', 'GET', {
    repo: did
  })
}

type PostRecordType = {
  $type: 'app.bbs.post'
  section_id: string;
  title: string;
  text: string;
  edited?: string
  created?: string
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
  commit: {
    cid: string
    rev: string
  },
  results: {
    $type: "com.atproto.web5.directWrites#createResult"
    cid: string
    uri: string
  }[]
}

/* 发帖、回帖、点赞、编辑帖子PDS写入操作 */
export async function postsWritesPDSOperation(params: {
  record: PostRecordType
  did: string
  rkey?: string
  type?: 'update' | 'create'
}) {
  const operateType = params.type || 'create'
  const pdsClient = getPDSClient()

  const rkey = params.rkey || TID.next().toString()

  const newRecord = {
    created: dayjs.utc().format(),
    ...params.record,
  }

  const $typeMap = {
    create: "com.atproto.web5.preDirectWrites#create",
    update: "com.atproto.web5.preDirectWrites#update",
  }

  const writeRes = await sessionWrapApi(() => pdsClient.com.atproto.web5.preDirectWrites({
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

  // const commit = await signCommit(uncommit, keyPair)  会报错，所以就把源码拿出来了
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

  if (operateType === 'update') {
    const res = await server<CreatePostResponse>('/record/update', 'POST', serverParams)

    return res.results[0].uri
  }
  
  const res = await server<CreatePostResponse>('/record/create', 'POST', serverParams)

  return res.results[0].uri
}

async function sessionWrapApi(callback: () => Promise<any>): Promise<void> {
  try {
    const result =  await callback()
    return result
  } catch (error) {
    if (error.message.includes('Token has expired')) {
      await getPDSClient().sessionManager.refreshSession()
      return await callback()
    }
    throw error
  }
}