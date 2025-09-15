'use client'

import S from "@/app/posts/[postId]/index.module.scss";
import PostItem from "@/app/posts/[postId]/_components/PostItem";
import PostDiscuss from "@/app/posts/[postId]/_components/PostDiscuss";
import CardWindow from "@/components/CardWindow";
import { useRequest } from "ahooks";
import server from "@/server";
import { useEffect, useImperativeHandle } from "react";
import { PostFeedItemType } from "@/app/posts/utils";
import BBSPagination from "@/components/BBSPagination";
import useCurrentUser from "@/hooks/useCurrentUser";

const PAGE_SIZE = 20

type PostDetailProps = {
  breadCrumb?: React.ReactNode;
  postId: string
  componentRef?: React.Ref<{
    commentRootPostRecord: any
  }>;
}

const PostDetail = (props: PostDetailProps) => {
  const { breadCrumb, postId } = props;

  const { userProfile } = useCurrentUser()

  const { data: originPosterInfo, refresh: refreshOrigin } = useRequest(async () => {
    const result = await server('/post/detail', 'GET', {
      uri: postId,
      viewer: userProfile?.did
    })
    return result
  }, {
    refreshDeps: [postId, userProfile?.did]
  })

  const { data: commentList, run: reLoadComment } = useRequest(async (page: number = 1) => {
    const result = await server<{
      comments: PostFeedItemType[],
      total: number,
      page:number,
    }>('/comment/list', 'POST', {
      post: postId,
      page,
      per_page: PAGE_SIZE,
      viewer: userProfile?.did
    })
    return result
  }, {
    manual: true,
    refreshDeps: [postId, userProfile?.did]
  })

  useImperativeHandle(props.componentRef, () => {
    return {
      commentRootPostRecord: {
        type: "comment",
        postUri: originPosterInfo?.uri,
        sectionId: originPosterInfo?.section_id,
        refresh: reloadList
      }
    }
  })

  useEffect(() => {
    reLoadComment()
  }, [userProfile?.did]);

  const reloadList = () => {
    refreshOrigin()
    reLoadComment(1)
  }

  return <CardWindow
    noInnerWrap
    wrapClassName={S.window}
    headerExtra={breadCrumb}
  >
    <div className={S.wrap}>
      {commentList?.page === 1 && <PostItem
        isOriginPoster
        rootUri={originPosterInfo?.uri}
        postInfo={originPosterInfo}
        isAuthor={originPosterInfo?.author.did === userProfile?.did}
        floor={1}
        sectionId={originPosterInfo?.section_id}
        refresh={reloadList}
      />}

      {commentList?.comments.map((p, idx) => {
        const floor = ((commentList?.page || 1) - 1) * PAGE_SIZE + idx + 2;
        return <PostItem
          key={p.uri}
          postInfo={p}
          floor={floor}
          isOriginPoster={p.author.did === originPosterInfo?.author?.did}
          sectionId={originPosterInfo?.section_id}
          rootUri={originPosterInfo?.uri}
          refresh={reloadList}
        />
      })}

      <BBSPagination
        hideOnSinglePage
        pageSize={20}
        total={commentList?.total || 0}
        onChange={(page) => reLoadComment(page)}
        align={'center'}
      />

      <PostDiscuss
        sectionId={originPosterInfo?.section_id}
        postUri={postId}
        refresh={reloadList}
      />
    </div>
  </CardWindow>
}

export default PostDetail;