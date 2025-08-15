'use client'

import S from './index.module.scss'
import CardWindow from "@/components/CardWindow";
import Marquee from "react-fast-marquee";
import AvatarIcon from '@/assets/avatar/icons/icon1.svg'
import { PostFeedItemType } from "@/app/posts/utils";
import dayjs from "dayjs";
import { useRequest } from "ahooks";
import server from "@/server";

const NoticeBoard = () => {
  const { data: list } = useRequest(async () => {
    const result = await server<{ posts: PostFeedItemType[] }>('/post/top', 'POST', {
      section_id: '0',
    })
    return result.posts || []
  })

  return <CardWindow
    wrapClassName={S.wrap}
    header="BBS论坛告示栏"
    headerClassName={S.header}
    noInnerWrap
  >
    <div className={S.content}>
      <Marquee autoFill speed={120}>
        <p style={{marginRight: 20}} className={S.marquee}>
          欢迎你
          <span>xxx</span>
          ！这是你第 1 度来到 BBS 社区，目前论坛有 0 人与你同在，有 0 人曾与你共享同一个网络～
        </p>
      </Marquee>

      <div className={S.cardContent}>
        {list?.map(item => {
          return <NoticeCardItem noticeInfo={item} key={item.uri}/>
        })}
      </div>
    </div>
  </CardWindow>
}

export default NoticeBoard;

export function NoticeCardItem({ noticeInfo }: {
  noticeInfo?: PostFeedItemType
}) {
  return <div className={S.cardItem}>
    <p className={S.title}>
      {noticeInfo?.title}
    </p>

    <div className={S.info}>
      <p className={'flex items-center gap-[8px]'}><AvatarIcon />{noticeInfo?.author?.displayName}</p>
      <span>{dayjs(noticeInfo?.updated).format('YYYY/MM/DD')}</span>
    </div>
  </div>
}