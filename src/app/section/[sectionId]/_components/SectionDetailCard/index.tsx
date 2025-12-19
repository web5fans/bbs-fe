'use client'

import CardWindow from "@/components/CardWindow";
import S from './index.module.scss'
import Button from "@/components/Button";
import BreadCrumbs from "@/components/BreadCrumbs";
import { SectionItem } from "@/app/posts/utils";
import useCurrentUser from "@/hooks/useCurrentUser";
import SectionInfo from "@/app/section/[sectionId]/_components/SectionDetailCard/SectionInfo";
import { useRouter } from "next/navigation";
import TextHoverFocus from "@/components/TextHoverFocus";
import Link from "next/link";

const SectionDetailCard = (props: {
  sectionInfo?: SectionItem
}) => {
  const { sectionInfo } = props;
  const { hasLoggedIn, isWhiteUser } = useCurrentUser()

  const router = useRouter()

  return <CardWindow
    wrapClassName={S.wrap}
    headerExtra={<BreadCrumbs
      className={S.breadCrumb}
      breads={[{
        title: '首页',
        route: '/posts'
      }, {
        title: '版区详情'
      }]}
    />}
  >
    <div className={S.innerWrap}>
      <SectionInfo sectionInfo={sectionInfo} />

      {/*<div className={S.buttonWrap}>*/}
      {/*  <Link href={location.pathname + '/manage'} prefetch>*/}
      {/*    <TextHoverFocus text={'版区管理'} />*/}
      {/*  </Link>*/}
      {/*</div>*/}
    </div>


  </CardWindow>
}

export default SectionDetailCard;