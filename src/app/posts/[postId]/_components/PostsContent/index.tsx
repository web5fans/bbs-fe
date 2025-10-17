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

type PostContentProps = {
  breadCrumb?: React.ReactNode;
  postId: string
  componentRef?: React.Ref<{
    commentRootPostRecord: any
  }>;
  refreshOrigin: () => void
  originPost: any
}

const PAGE_SIZE = 20

const PostsContent = (props: PostContentProps) => {
  const { breadCrumb, postId, refreshOrigin, originPost } = props;

  const { userProfile } = useCurrentUser()

  const { data: commentList, run: reLoadComment, refresh: refreshComment } = useRequest(async (page: number = 1) => {
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
        postUri: originPost?.uri,
        sectionId: originPost?.section_id,
        refresh: reloadList
      }
    }
  })

  useEffect(() => {
    reLoadComment()
  }, [userProfile?.did]);

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
      {commentList?.page === 1 && <PostItem
        isOriginPoster
        rootUri={originPost?.uri}
        postInfo={originPost}
        isAuthor={originPost?.author?.did === userProfile?.did}
        floor={1}
        refresh={reloadList}
      />}

      {commentList?.comments.map((p, idx) => {
        const floor = ((commentList?.page || 1) - 1) * PAGE_SIZE + idx + 2;
        const info = {...p, section_id: originPost?.section_id}
        return <PostItem
          key={p.uri}
          postInfo={info}
          floor={floor}
          isOriginPoster={p.author.did === originPost?.author?.did}
          rootUri={originPost?.uri}
          rootDisabled={originPost.is_disabled}
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
        sectionId={originPost?.section_id}
        postUri={postId}
        refresh={reloadList}
      />
    </div>
  </CardWindow>
}

export default PostsContent;