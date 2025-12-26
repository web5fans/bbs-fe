'use client'

import { useRouter, useSearchParams } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";
import React, { createContext, useEffect, useMemo, useRef } from "react";
import { SectionItem } from "@/app/posts/utils";
import PageNoAuth from "@/components/PageNoAuth";
import { useRequest } from "ahooks";
import server from "@/server";

type AnchorInfoType = {
  comment: {
    uri: string
    idx: number
  },
  reply?: {
    uri: string
    idx: number
  }
}

const SectionAdminContext = createContext<{
  isSectionAdmin: boolean
  rootPost: any
  sectionInfo: SectionItem
  refreshRootPost: () => void
  anchorInfo?: AnchorInfoType
  clearAnchorInfo: () => void
}>({
  isSectionAdmin: false,
  rootPost: {} as any,
  sectionInfo: {} as SectionItem,
  refreshRootPost: () => {},
  clearAnchorInfo: () => {}
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
  const searchParams = useSearchParams()
  const anchorInfo = useRef<AnchorInfoType | undefined>(undefined)

  useEffect(() => {
    if (!searchParams.get('comment')) return
    anchorInfo.current = {
      comment: {
        uri: searchParams.get('comment'),
        idx: Number(searchParams.get('commentIdx'))
      }
    }
    if (anchorInfo.current && searchParams.get('reply') && searchParams.get('replyIdx')) {
      anchorInfo.current.reply = {
        uri: searchParams.get('reply'),
        idx: Number(searchParams.get('replyIdx'))
      }
    }
  }, []);

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

  return <SectionAdminContext.Provider value={{
    isSectionAdmin,
    rootPost: postInfo,
    sectionInfo,
    refreshRootPost:
    refreshOrigin,
    anchorInfo: anchorInfo.current,
    clearAnchorInfo: () => anchorInfo.current = undefined
  }}>
    {children}
  </SectionAdminContext.Provider>
}

export default Post404Auth;

export function usePost() {
  const context = React.useContext(SectionAdminContext);

  return context;
}