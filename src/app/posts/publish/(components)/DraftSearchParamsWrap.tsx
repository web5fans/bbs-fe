import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRequest } from "ahooks";
import server from "@/server";
import { PostFeedItemType } from "@/app/posts/utils";
import { getPostUriHref } from "@/lib/postUriHref";

export type SetPostContentParamsType = {
  title: string;
  text: string;
  sectionId: string;
  created: string;
  uri: string }

const DraftSearchParamsWrap = (props: {
  children: React.ReactNode
  setPostContent: (obj: SetPostContentParamsType) => void
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { run: getDraftInfo } = useRequest(async (uri: string) => {
    const result = await server<PostFeedItemType>('/post/detail_draft', 'GET', {
      uri
    })
    props.setPostContent({ ...result, sectionId: result.section_id,  })
    return result
  }, {
    manual: true
  })

  // 删除单个参数
  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key); // 删除指定参数

    // 构建新URL
    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname; // 如果没有参数了，只保留路径

    router.replace(newUrl);
  };

  useEffect(() => {
    const draft = searchParams.get('draft')
    if (draft) {
      const postUri = getPostUriHref(draft)
      getDraftInfo(postUri)
      removeParam('draft')
    }
  }, []);

  return props.children
}

export default DraftSearchParamsWrap;