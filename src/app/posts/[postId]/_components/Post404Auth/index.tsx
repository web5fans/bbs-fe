import CardWindow from "@/components/CardWindow";
import Button from "@/components/Button";
import S from './index.module.scss'
import FaceIcon from '@/assets/login/multiDid/face.svg'
import { useRouter } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";
import React, { createContext, useMemo } from "react";
import { SectionItem } from "@/app/posts/utils";

const SectionAdminContext = createContext({
  isSectionAdmin: false
})

const Post404 = ({ originPost, sectionInfo, children }: {
  originPost: { reasons_for_disabled?: string; [key: string]: any }
  sectionInfo?: SectionItem
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { userProfile } = useCurrentUser()

  const isSectionAdmin = useMemo(() => {
    if (!sectionInfo || !userProfile) return false;
    const admins = sectionInfo.administrators.map(i => i.did)
    return admins?.includes(userProfile.did)
  }, [sectionInfo, userProfile])

  if (!originPost || !sectionInfo) return null;

  if (originPost.is_disabled && !isSectionAdmin) {
    return <CardWindow wrapClassName={S.wrap}>
      <div className={S.content}>
        <FaceIcon className={S.faceIcon} />
        <p className={S.tips}>Ops,该帖子已被管理员或版主取消公开，原因：{originPost.reasons_for_disabled}</p>
        <Button type={'primary'} className={S.button} onClick={() => router.replace('/posts')}>进主站看看</Button>
      </div>
    </CardWindow>
  }

  return <SectionAdminContext.Provider value={{ isSectionAdmin }}>
    {children}
  </SectionAdminContext.Provider>
}

export default Post404;

export function useSectionAdmin() {
  const context = React.useContext(SectionAdminContext);

  return context;
}