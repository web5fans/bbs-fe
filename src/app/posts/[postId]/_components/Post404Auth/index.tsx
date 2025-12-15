'use client'

import { useRouter } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";
import React, { createContext, useMemo } from "react";
import { SectionItem } from "@/app/posts/utils";
import PageNoAuth from "@/components/PageNoAuth";
import { useRequest } from "ahooks";
import server from "@/server";

const SectionAdminContext = createContext({
  isSectionAdmin: false,
  rootPost: {} as any,
  sectionInfo: {} as SectionItem,
  refreshRootPost: () => {}
})

const Post404Auth = (props: {
  children: React.ReactNode;
  postId: string
  fetchSection?: boolean
  section?: SectionItem
}) => {
  const { children, postId, fetchSection } = props;
  const router = useRouter();

  const { userProfile } = useCurrentUser()

  const { data: postInfo, refresh: refreshOrigin } = useRequest(async () => {
    try {
      const result = await server('/post/detail', 'GET', {
        uri: postId,
        viewer: userProfile?.did
      })
      return result
    } catch (err) {
      const { error: errInfo, message } = err.response.data
      if (errInfo === "IsDisabled") {
        return {
          uri: postId,
          is_disabled: true,
          reasons_for_disabled: message
        }
      }
    }
  }, {
    refreshDeps: [postId, userProfile?.did]
  })

  const { data: sectionData } = useRequest(async () => {
    const result = await server<SectionItem>('/section/detail', 'GET', {
      id: postInfo?.section_id
    })
    return result
  }, {
    ready: !!fetchSection && !!postInfo?.section_id
  })

  const sectionInfo = props.section || sectionData

  const isSectionAdmin = useMemo(() => {
    if (!sectionInfo || !userProfile) return false;
    return sectionInfo.owner?.did === userProfile.did
  }, [sectionInfo, userProfile])

  if (!postInfo || !sectionInfo) return null;

  if (postInfo.is_disabled && !isSectionAdmin) {
    return <PageNoAuth
      title={`Ops,该帖子已被管理员或版主取消公开，原因：${postInfo.reasons_for_disabled}`}
      buttonProps={{
        text: '进主站看看',
        onClick: () => router.replace('/posts')
      }}
    />
  }

  return <SectionAdminContext.Provider value={{ isSectionAdmin, rootPost: postInfo, sectionInfo, refreshRootPost: refreshOrigin }}>
    {children}
  </SectionAdminContext.Provider>
}

export default Post404Auth;

export function usePost() {
  const context = React.useContext(SectionAdminContext);

  return context;
}