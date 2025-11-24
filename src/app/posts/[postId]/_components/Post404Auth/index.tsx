import { useRouter } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";
import React, { createContext, useMemo } from "react";
import { SectionItem } from "@/app/posts/utils";
import PageNoAuth from "@/components/PageNoAuth";

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
    return sectionInfo.owner?.did === userProfile.did
  }, [sectionInfo, userProfile])

  if (!originPost || !sectionInfo) return null;

  if (originPost.is_disabled && !isSectionAdmin) {
    return <PageNoAuth
      title={`Ops,该帖子已被管理员或版主取消公开，原因：${originPost.reasons_for_disabled}`}
      buttonProps={{
        text: '进主站看看',
        onClick: () => router.replace('/posts')
      }}
    />
  }

  return <SectionAdminContext.Provider value={{ isSectionAdmin }}>
    {children}
  </SectionAdminContext.Provider>
}

export default Post404;

export function useSection() {
  const context = React.useContext(SectionAdminContext);

  return context;
}