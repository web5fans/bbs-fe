'use client'

import CardWindow from "@/components/CardWindow";
import S from './index.module.scss'
import { LayoutCenter } from "@/components/Layout";
import Tabs from "@/components/Tabs";
import { NOTIFY_TYPE_ENUM } from "@types/notification";
import MessageList from "./_components/MessageList";
import { useState } from "react";
import { useBoolean } from "ahooks";
import server from "@/server";
import useCurrentUser from "@/hooks/useCurrentUser";
import useNotify from "@/store/notification";

const tabs = [{
  name: '全部',
  value: 'all',
  type: []
}, {
  name: '点赞',
  value: 'like',
  type: [NOTIFY_TYPE_ENUM.NEW_LIKE]
}, {
  name: '评论',
  value: 'comment',
  type: [NOTIFY_TYPE_ENUM.NEW_COMMENT]
}, {
  name: '赞赏',
  value: 'tip',
  type: [NOTIFY_TYPE_ENUM.NEW_TIP]
},{
  name: '其他',
  value: 'others',
  type: [NOTIFY_TYPE_ENUM.NEW_REPLY, NOTIFY_TYPE_ENUM.BE_DISPLAYED, NOTIFY_TYPE_ENUM.BE_HIDDEN, NOTIFY_TYPE_ENUM.NEW_DONATE]
}]

const page = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [isReadAll, { setTrue: setReadAll }] = useBoolean(false)

  const { userProfile } = useCurrentUser()

  const readAll = async () => {
    await server('/notify/read', 'POST', {
      repo: userProfile?.did,
      target: null
    })
    useNotify.getState().updateUnReadNum()
    setReadAll()
  }

  return <LayoutCenter>
    <CardWindow header={'消息通知'} wrapClassName={S.window} noInnerWrap>
      <div className={S.wrap}>
        <Tabs
          tabItems={tabs}
          classnames={{ content: '!p-0' }}
          tabsExtra={<a className={S.readAll} onClick={readAll}>全部已读</a>}
          onChange={(tab) => setActiveTab(tab)}
        >
          <div className={S.content}>
            {
              tabs.map((tab, index) => {
                if (activeTab !== tab.value) return null
                return <MessageList types={tab.type} isReadAll={isReadAll} />
              })
            }
          </div>
        </Tabs>
      </div>
    </CardWindow>
  </LayoutCenter>
}

export default page;