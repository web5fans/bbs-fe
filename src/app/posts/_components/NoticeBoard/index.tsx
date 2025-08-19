'use client'

import S from './index.module.scss'
import CardWindow from "@/components/CardWindow";
import Marquee from "react-fast-marquee";
import AvatarIcon from '@/assets/avatar/icons/icon1.svg'
import { PostFeedItemType } from "@/app/posts/utils";
import { useRequest } from "ahooks";
import server from "@/server";
import { useRouter } from "next/navigation";
import utcToLocal from "@/lib/utcToLocal";

const NoticeBoard = () => {
  const { data: list } = useRequest(async () => {
    const result = await server<{ posts: PostFeedItemType[] }>('/post/top', 'POST', {
      section_id: '0',
    })
    return result.posts || []
  })

  const router = useRouter()

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
        {[...(list || []), ...(list || []), ...(list || []), ...(list || [])]?.map(item => {
          return <NoticeCardItem
            noticeInfo={item}
            onClick={() => router.push('/posts/' + encodeURIComponent(item.uri))}
          />
        })}
      </div>
    </div>
  </CardWindow>
}

export default NoticeBoard;

export function NoticeCardItem({ noticeInfo, onClick }: {
  noticeInfo?: PostFeedItemType
  onClick: () => void
}) {
  return <div className={S.cardItem} onClick={onClick}>
    <p className={S.title}>
      {noticeInfo?.title}
    </p>

    <div className={S.info}>
      <p className={'flex items-center gap-[8px]'}><AvatarIcon />{noticeInfo?.author?.displayName}</p>
      <span>{utcToLocal(noticeInfo?.updated)}</span>
    </div>
  </div>
}