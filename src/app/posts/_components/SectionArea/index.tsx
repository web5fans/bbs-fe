'use client'

import S from './index.module.scss'

import { useRequest } from "ahooks";
import { getSectionList } from "@/app/posts/utils";
import SectionItem from './SectionItem'
import cx from "classnames";

const SectionArea = () => {
  const { data: sectionList } = useRequest(async () => {
    return await getSectionList()
  })

  return <div className={cx(S.wrap, S.pc)}>
    <p className={S.title}>版区</p>
    <div className={S.sections}>
      {sectionList?.map((section, index) => (<SectionItem key={section.id} section={section} />))}
    </div>
  </div>
}

export default SectionArea;