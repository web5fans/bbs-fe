export enum NSID_TYPE_ENUM {
  POST = 'app.bbs.post',
  POST_COMMENT = 'app.bbs.comment',
  POST_REPLY = 'app.bbs.reply',
  SECTION = 'app.bbs.section',
  COMMUNITY = 'app.bbs.community',
}

export enum INCOME_STATUS_ENUM {
  WAITING_ACCOUNT = 1,
  ACCOUNTING = 3,
  SUCCESS = 4
}

export const incomeStatusMap = {
  [INCOME_STATUS_ENUM.WAITING_ACCOUNT]: 'wait',
  [INCOME_STATUS_ENUM.ACCOUNTING]: 'pending',
  [INCOME_STATUS_ENUM.SUCCESS]: 'success',
}