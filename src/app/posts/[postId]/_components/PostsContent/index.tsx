import S from './index.module.scss'
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRequest } from "ahooks";
import server from "@/server";
import { PostFeedItemType } from "@/app/posts/utils";
import { useEffect, useImperativeHandle } from "react";
import CardWindow from "@/components/CardWindow";
import PostItem from "@/app/posts/[postId]/_components/PostItem";
import BBSPagination from "@/components/BBSPagination";
import PostDiscuss from "@/app/posts/[postId]/_components/PostDiscuss";
import { usePost } from "@/app/posts/[postId]/_components/Post404Auth";
import { usePostCommentReply } from "@/provider/PostReplyProvider";
import { CircleLoading } from "@/components/Loading";
import cx from "classnames";

type PostContentProps = {
  breadCrumb?: React.ReactNode;
  postId: string
  componentRef?: React.Ref<{
    comment: () => void
  }>;
}

const PAGE_SIZE = 20

const PostsContent = (props: PostContentProps) => {
  const { breadCrumb, postId } = props;

  const { rootPost: originPost, refreshRootPost: refreshOrigin, anchorInfo, freshV } = usePost()

  const { userProfile } = useCurrentUser()

  const defaultCommentIdx = anchorInfo?.comment?.idx

  const { openModal } = usePostCommentReply()

  const { data: commentList, run: reLoadComment, refresh: refreshComment } = useRequest(async (curPage?: number) => {
    const defaultPage = defaultCommentIdx ?  Math.ceil(Number(defaultCommentIdx) / PAGE_SIZE) : 1;
    const page = curPage || defaultPage
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
      comment: () => {
        openModal({
          type: "comment",
          postUri: originPost?.uri,
          sectionId: originPost?.section_id,
          refresh: reloadList
        })
      }
    }
  })

  useEffect(() => {
    reLoadComment()
  }, [userProfile?.did, freshV]);

  const reloadList = () => {
    refreshOrigin()
    refreshComment()
  }

  return <CardWindow
    noInnerWrap
    wrapClassName={S.window}
    headerExtra={breadCrumb}
  >
    <div className={S.wrap}>
      {!commentList ? <div className={cx('flex items-center justify-center', S.loadingWrap)}>
        <CircleLoading className={S.loading} />
      </div> : <>
        {commentList?.page === 1 && <PostItem
          isOriginPoster
          rootUri={originPost?.uri}
          postInfo={originPost}
          floor={1}
          refresh={reloadList}
          key={`post-item-${originPost?.uri}-${freshV}`}
        />}

        {commentList?.comments?.map((p, idx) => {
          const floor = ((commentList?.page || 1) - 1) * PAGE_SIZE + idx + 2;
          const info = {...p, section_id: originPost?.section_id}
          return <PostItem
            postInfo={info}
            floor={floor}
            isOriginPoster={p.author.did === originPost?.author?.did}
            rootUri={originPost?.uri}
            rootDisabled={originPost.is_disabled}
            refresh={reloadList}
            key={`post-item-${p?.uri}-${freshV}`}
          />
        })}

        <BBSPagination
          current={commentList?.page || 1}
          hideOnSinglePage
          pageSize={20}
          total={commentList?.total || 0}
          onChange={(page) => reLoadComment(page)}
          align={'center'}
        />
      </>}


      <PostDiscuss
        sectionId={originPost?.section_id}
        postUri={postId}
        refresh={reloadList}
      />
    </div>
  </CardWindow>
}

export default PostsContent;