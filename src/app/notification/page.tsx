'use client'

import CardWindow from "@/components/CardWindow";
import S from './index.module.scss'
import { LayoutCenter } from "@/components/Layout";
import Tabs from "@/components/Tabs";
import { EmptyText } from "@/components/Empty";
import MessageItem from "./_components/MessageItem";

const page = () => {

  const tabs = [{
    name: '全部',
    value: 'all'
  }, {
    name: '点赞',
    value: 'like'
  }, {
    name: '评论',
    value: 'comment'
  }, {
    name: '赞赏',
    value: 'system'
  },{
    name: '其他',
    value: 'other'
  }]

  return <LayoutCenter>
    <CardWindow header={'消息通知'} wrapClassName={S.window} noInnerWrap>
      <div className={S.wrap}>
        <Tabs
          tabItems={tabs}
          classnames={{ content: '!p-0' }}
          tabsExtra={<a className={S.readAll}>全部已读</a>}
        >
          <div>
            {/*<EmptyText message={'暂无消息，快去浏览帖子互动吧！'} />*/}
            <MessageItem />
            <MessageItem />
            <MessageItem />
            <MessageItem />
            <MessageItem />
          </div>
        </Tabs>
      </div>
    </CardWindow>
  </LayoutCenter>
}

export default page;