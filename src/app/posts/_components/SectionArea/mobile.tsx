import { useRequest } from "ahooks";
import { getSectionList } from "@/app/posts/utils";
import cx from "classnames";
import S from "./index.module.scss";
import SectionItem from './SectionItem'

const SectionAreaMobile = () => {
  const { data: sectionList } = useRequest(async () => {
    return await getSectionList()
  })

  const hasMoreCard = sectionList?.length > 2

  return <div className={cx(S.wrap, S.mobile)}>
    <p className={S.title}>版区</p>
    <div className={cx(S.sections, hasMoreCard && S.moreCard)}>
      {sectionList?.map((section, index) => (<SectionItem key={section.id + '_mobile'} section={section} />))}
    </div>
  </div>
}

export default SectionAreaMobile;