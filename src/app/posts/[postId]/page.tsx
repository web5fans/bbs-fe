'use client'

import S from './index.module.scss'
import PostDetail from "@/app/posts/[postId]/PostDetail";
import BreadCrumbs from "@/components/BreadCrumbs";
import FloatingMark, { useFloatingMarkDistance } from "@/components/FloatingMark";
import Button from "@/components/Button";
import { useParams } from "next/navigation";
import cx from "classnames";
import useCurrentUser from "@/hooks/useCurrentUser";
import { getPostUriHref } from "@/lib/postUriHref";
import { LayoutCenter } from "@/components/Layout";
import { usePostCommentReply } from "@/provider/PostReplyProvider";
import { useRef } from "react";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>()

  const { isWhiteUser } = useCurrentUser()

  const { rootRef, stickyRef } = useFloatingMarkDistance()

  const decodeId = getPostUriHref(postId)

  const detailRef = useRef<{ commentRootPostRecord: any } | null>(null)

  return <LayoutCenter>
    <div
      className={S.container}
      ref={rootRef}
    >
      <PostDetail
        componentRef={detailRef}
        postId={decodeId}
        breadCrumb={<BreadCrumbs
          className={S.breadCrumb}
          breads={[{
            title: '首页',
            route: '/posts'
          }, {
            title: '帖子详情'
          }]}
        />}
      />
      <FixedMark detailRef={detailRef} stickyRef={stickyRef} isWhiteUser={isWhiteUser} />
    </div>
  </LayoutCenter>
}

function FixedMark(props: {
  stickyRef: React.RefObject<HTMLDivElement | null>,
  isWhiteUser?: boolean
  detailRef: React.RefObject<{ commentRootPostRecord: any } | null>
}) {
  const { stickyRef, isWhiteUser, detailRef } = props;
  const { openModal } = usePostCommentReply()

  return <FloatingMark ref={stickyRef}>
    <Button
      type={'primary'}
      className={cx(S.comment, !isWhiteUser && '!hidden')}
      onClick={() => {
        openModal(detailRef.current?.commentRootPostRecord)
        document.getElementById('comment_post')?.scrollIntoView({ behavior: "smooth" });
      }}
    ><CommentIcon /></Button>
  </FloatingMark>
}

export function CommentIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M20 20H18.1818V18.1818H16.3636V16.3636H18.1818V3.63636H20V20ZM16.3636 16.3636H3.63636V14.5455H16.3636V16.3636ZM3.63636 14.5455H1.81818V12.7273H3.63636V14.5455ZM1.81818 12.7273H0V3.63636H1.81818V12.7273ZM12.7273 10.9091H3.63636V9.09091H12.7273V10.9091ZM16.3636 7.27273H3.63636V5.45455H16.3636V7.27273ZM3.63636 3.63636H1.81818V1.81818H3.63636V3.63636ZM18.1818 3.63636H16.3636V1.81818H18.1818V3.63636ZM16.3636 1.81818H10H3.63636V0H16.3636V1.81818Z"
      fill="white"
    />
  </svg>
}