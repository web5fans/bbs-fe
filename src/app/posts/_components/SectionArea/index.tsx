'use client'

import S from './index.module.scss'

import ReadIcon from '@/assets/posts/read.svg'
import ReplyIcon from '@/assets/posts/reply.svg'
import SectionEarth from '@/assets/posts/section.svg'
import { useRequest } from "ahooks";
import { getSectionList } from "@/app/posts/utils";
import type { SectionItem } from "@/app/posts/utils";
import { useRouter } from "next/navigation";

const SectionArea = () => {
  const { data: sectionList } = useRequest(async () => {
    return await getSectionList()
  })

  return <div className={S.wrap}>
    <p className={S.title}>版区</p>
    {sectionList?.map((section, index) => (<SectionItem key={section.id} section={section} />))}
  </div>
}

export default SectionArea;

function SectionItem(props: {
  section: SectionItem;
}) {
  const { section } = props;
  const router = useRouter()

  return <div
    className={S.card}
    onClick={() => router.push(`/section/${section.id}`)}
  >
    <div className={S.image}>
      <SectionEarth />
    </div>
    <div className={S.content}>
      <p className={S.cardTitle}>{section.name}</p>
      <div className={S.info}>
        <p className={S.infoItem}>
          <ReadIcon />
          0
        </p>
        <p className={S.infoItem}>
          <ReplyIcon />
          0
        </p>
        {/*<p className={S.infoItem}>*/}
        {/*  <MoneyIcon />*/}
        {/*  666*/}
        {/*</p>*/}
      </div>
    </div>
  </div>
}