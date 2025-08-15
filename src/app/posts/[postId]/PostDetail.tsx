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

  const { data: originPosterInfo } = useRequest(async () => {
    const result = await server('/post/detail', 'GET', {
      uri: postId
    })
    return result
  }, {
    refreshDeps: [postId]
  })

  const { data: replyList, run } = useRequest(async (page: number = 1) => {
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
    run()
  }, []);

  return <CardWindow
    noInnerWrap
    wrapClassName={S.window}
    headerExtra={breadCrumb}
  >
    <div className={S.wrap}>
      <PostItem isOriginPoster postInfo={originPosterInfo} floor={1} />

      {replyList?.posts.map((p, idx) => {
        return <PostItem postInfo={p} floor={idx+2} />
      })}

      <Pagination
        pageSize={20}
        total={replyList?.total || 0}
        onChange={(page) => run(page)}
        className={S.pagination}
        align={'center'}
      />

      <PostDiscuss postUri={postId} refresh={() => run(1)} />
    </div>
  </CardWindow>
}

export default PostDetail;

function OuterWrap() {
  return <div>

  </div>
}