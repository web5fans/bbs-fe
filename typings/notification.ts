/**
 * 表示一条打赏通知的完整类型
 */
export type NotifyItemType = {
  /** 打赏金额（例如：100000000000 聪） */
  amount: number;
  /** 通知创建时间，ISO 8601 格式字符串 */
  created: string;
  /** 通知的唯一标识符 */
  id: string;
  /** 通知类型 */
  n_type: NOTIFY_TYPE_ENUM;
  /** 通知是否已读，null 表示未读 */
  readed: null | boolean | string;
  /** 接收者信息 */
  receiver: ActorProfile;
  /** 发送者信息 */
  sender: ActorProfile;
  /** 目标内容（如评论或帖子） */
  target: NotificationTarget;
  target_uri: string;
  /** 通知标题 */
  title: string;
}

/**
 * 用户或参与者的个人资料信息
 * $type 字段表明这是一个应用内的 Actor 类型
 */
interface ActorProfile {
  /** 类型标识符，固定为 'app.actor.profile' */
  $type: 'app.actor.profile';
  /** CKB 区块链地址 */
  ckb_addr: string;
  /** 评论数量（字符串形式） */
  comment_count: string;
  /** 资料创建时间，ISO 8601 格式字符串 */
  created: string;
  /** 去中心化身份标识符 (DID) */
  did: string;
  /** 用户显示名称 */
  displayName: string;
  /** 用户句柄（通常为用户名+域名） */
  handle: string;
  /** 点赞数量（字符串形式） */
  like_count: string;
  /** 发帖数量（字符串形式） */
  post_count: string;
}

/**
 * 通知指向的具体目标内容
 */
interface NotificationTarget {
  /** 可能是目标在列表中的索引位置 */
  index: number;
  /** 命名空间标识符，表明目标类型 */
  nsid: "app.bbs.post" | "app.bbs.comment" | "app.bbs.reply";
  /** 目标所属的帖子信息 */
  post: PostInfo;
  comment?: { index: number; text: string; uri: string }
  /** 目标的内容文本（HTML 格式） */
  text: string;
  title?: string
  reasons_for_disabled?: string
}

/**
 * 帖子信息
 */
interface PostInfo {
  /** 帖子标题 */
  title: string;
  /** 帖子的唯一资源标识符 (AT URI) */
  uri: string;
}

export enum NOTIFY_TYPE_ENUM {
  NEW_COMMENT = '0',
  NEW_REPLY = '1',
  NEW_LIKE = '2',
  NEW_TIP = '3',
  NEW_DONATE = '4',
  BE_HIDDEN = '5',
  BE_DISPLAYED = '6',
}