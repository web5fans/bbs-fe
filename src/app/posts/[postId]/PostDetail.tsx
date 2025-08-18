'use client'

import S from "@/app/posts/[postId]/index.module.scss";
import PostItem from "@/app/posts/[postId]/_components/PostItem";
import Pagination from "rc-pagination";
import PostDiscuss from "@/app/posts/[postId]/_components/PostDiscuss";
import CardWindow from "@/components/CardWindow";
import { useRequest } from "ahooks";
import server from "@/server";
import { useEffect } from "react";
import { PostFeedItemType } from "@/app/posts/utils";

type PostDetailProps = {
  breadCrumb?: React.ReactNode;
  sectionId?: string
  postId: string
}

const PostDetail = (props: PostDetailProps) => {
  const { breadCrumb, postId } = props;

  const { data: originPosterInfo, refresh: refreshOrigin } = useRequest(async () => {
    const result = await server('/post/detail', 'GET', {
      uri: postId
    })
    return result
  }, {
    refreshDeps: [postId]
  })

  const { data: replyList, run: reLoadReply } = useRequest(async (page: number = 1) => {
    const result = await server<{
      replies: PostFeedItemType[],
      total: number,
      page:number,
    }>('/reply/list', 'POST', {
      root: postId,
      parent: postId,
      page,
      per_page: 20,
    })
    return result
  }, {
    manual: true,
    refreshDeps: [postId]
  })

  useEffect(() => {
    reLoadReply()
  }, []);

  return <CardWindow
    noInnerWrap
    wrapClassName={S.window}
    headerExtra={breadCrumb}
  >
    <div className={S.wrap}>
      <PostItem isOriginPoster postInfo={originPosterInfo} floor={1} />

      {replyList?.replies.map((p, idx) => {
        return <PostItem key={p.uri} postInfo={p} floor={idx+2} />
      })}

      <Pagination
        hideOnSinglePage
        pageSize={20}
        total={replyList?.total || 0}
        onChange={(page) => run(page)}
        className={S.pagination}
        align={'center'}
      />

      <PostDiscuss
        sectionId={originPosterInfo?.section_id}
        postUri={postId}
        refresh={() => {
          refreshOrigin()
          reLoadReply(1)
        }}
      />
    </div>
  </CardWindow>
}

export default PostDetail;

function OuterWrap() {
  return <div>

  </div>
}