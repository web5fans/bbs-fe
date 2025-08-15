import server from "@/server";
import usePDSClient from "@/hooks/usePDSClient";
import storage from "@/lib/storage";
import * as crypto from '@atproto/crypto'
import { signCommit, UnsignedCommit } from '@atproto/repo'
import { uint8ArrayToHex } from "@/lib/dag-cbor";
import { CID } from 'multiformats/cid'
import * as cbor from '@ipld/dag-cbor'
import { TID } from '@atproto/common-web'

export type PostFeedItemType = {
  uri: string,
  cid: string,
  author: { displayName: string, [key: string]: string },
  title: string,
  text: string,
  visited_count: number,
  visited: string, // 时间
  updated: string, // 时间
  created: string, // 时间
  section: string,       // 版区名称
}

export type SectionItem = {
  id: string;
  name: string
  owner?: Record<string, string> // 版主
  description?: string // 描述
  administrators?: any[]  // 管理员列表
}

/* 获取版区列表 */
export async function getSectionList() {
  return await server<SectionItem[]>('/section/list', 'GET')
}

type PostRecordType = {
  $type: 'app.bbs.post'
  section_id: string;
  title: string;
  text: string;
  created: string
} | {
  $type: 'app.bbs.reply'
  root: string  // 原帖uri
  parent?: string  // 原帖uri 或 回复的uri
  text: string;
  created: string
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

/* 发帖、跟帖回复 */
export async function publishNewPostAndReply(params: {
  record: PostRecordType
  did: string
}) {
  const pdsClient = usePDSClient()
  const rkey = TID.next().toString()
  const writeRes = await pdsClient.com.atproto.web5.preDirectWrites({
    repo: params.did,
    writes: [{
      $type: "com.atproto.web5.preDirectWrites#create",
      collection: params.record.$type,
      rkey,
      value: params.record
    }],
    validate: false,
  })

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

  const res = await server<CreatePostResponse>('/record/create', 'POST', {
    repo: params.did,
    rkey,
    value: params.record,
    signing_key: signingKey,
    root: {
      did: writerData.did,
      version: 3,
      rev: writerData.rev,
      prev: writerData.prev,
      data: writerData.data,
      signedBytes: uint8ArrayToHex(commit.sig),
    },
  })

  return res.results[0].uri
}