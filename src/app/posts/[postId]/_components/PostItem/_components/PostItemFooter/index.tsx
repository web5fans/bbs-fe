import S from './index.module.scss'
import PostLike from "@/app/posts/[postId]/_components/PostLike";
import { CSSProperties, useEffect, useRef, useState } from "react";
import LikeList from "../LikeList";
import { ReplyModalInfoType, usePostCommentReply } from "@/provider/PostReplyProvider";
import TabContentWrap from "../TabContentWrap";
import ReplyList, { ReplyListRefProps } from "../ReplyList";
import utcToLocal from "@/lib/utcToLocal";
import Donate from "../Donate";
import { PostItemType } from "@/app/posts/[postId]/_components/PostItem/index";
import TipDetailList from "../TipDetailList";
import SwitchPostHideOrOpen from "../SwitchPostHideOrOpen";
import cx from "classnames";
import useCurrentUser from "@/hooks/useCurrentUser";
import { usePost } from "@/app/posts/[postId]/_components/Post404Auth";

function formatDate(date: string) {
  return utcToLocal(date, 'YYYY/MM/DD HH:mm:ss')
}

type ShowTypeType = 'like' | 'reply' | 'donate' | undefined

const PostItemFooter = (props: {
  postInfo: PostItemType & { root_disabled?: boolean }
  floor: number
  rootUri: string
  refresh?: ReplyModalInfoType['refresh']
  switchPostVisibility: () => void
}) => {
  const { postInfo, floor, rootUri } = props
  const sectionId = postInfo.section_id

  const [ showType, setShowType ] = useState<ShowTypeType>(undefined)
  const [replyTotal, setReplyTotal] = useState('0')

  const parentRef = useRef<HTMLDivElement>(null)
  const replyListRef = useRef<ReplyListRefProps | null>(null)

  const [arrowPos, setArrowPos] = useState<{ left: string } | undefined>(undefined)

  const { openModal } = usePostCommentReply()

  const { anchorInfo } = usePost()

  useEffect(() => {
    if (!anchorInfo || anchorInfo.comment.uri !== postInfo.uri) return
    if (anchorInfo.reply) {
      setShowType('reply')
    }
  }, []);

  const changeShowType = (type: ShowTypeType) => {
    if (showType === type) {
      setShowType(undefined);
      return
    }
    setShowType(type)
  }

  const reply = () => {
    // const clientWidth = parentRef.current.clientWidth
    // const offsetLeft = parentRef.current.offsetLeft

    if (!replyTotal || replyTotal === '0') {

      // const shouldRect = window.innerWidth >= 1023
      //
      // openReplyModal(shouldRect ? {
      //   width: clientWidth,
      //   left: offsetLeft,
      //   transform: 'none'
      // }: undefined)
      openReplyModal()
      return;
    }
    changeShowType('reply')
  }

  const incrementalReplyTotal = () => {
    const total = Number(replyTotal) + 1
    setReplyTotal(`${total}`)
  }

  const openReplyModal = (obj?: CSSProperties) => {
    openModal({
      type: 'reply',
      postUri: rootUri,
      commentUri: postInfo.uri,
      toAuthor: postInfo.author,
      sectionId,
      refresh: (info, isEdit) => {
        if (!isEdit) incrementalReplyTotal()

        if (showType === 'reply') {
          replyListRef.current?.updateReplyList(info)
        }

      },
      rect: obj
    })
  }

  const editComment = () => {
    openModal({
      type: "comment",
      postUri: rootUri,
      sectionId,
      refresh: props.refresh,
      isEdit: true,
      content: postInfo
    })
  }

  const showLikeList = () => {
    changeShowType('like')
  }

  useEffect(() => {
    setReplyTotal(postInfo.reply_count || '0')
  }, [postInfo.reply_count]);

  const isNotMainPost = rootUri !== postInfo.uri

  return <>
    <div
      className={S.floor}
      ref={parentRef}
      onClick={e => {
        const target = e.target as HTMLDivElement
        const paddingRight = getComputedStyle(target).paddingRight.replace('px', '')
        const paddingleft = getComputedStyle(target).paddingLeft.replace('px', '')
        const width = (target.clientWidth - paddingRight - paddingleft) / 2
        setArrowPos({ left: (target.offsetLeft + width - 1) + 'px' })
      }}
    >
      <Donate
        count={postInfo.tip_count}
        showList={() => changeShowType('donate')}
        author={{
          displayName: postInfo.author.displayName,
          did: postInfo.author.did,
        }}
        uri={postInfo.uri}
        nsid={isNotMainPost ? 'app.bbs.comment' : 'app.bbs.post'}
      />
      {isNotMainPost ? <FooterOptions
        postInfo={postInfo}
        floor={floor}
        showLikeList={showLikeList}
        reply={reply}
        replyTotal={replyTotal}
        editComment={editComment}
        switchPostVisibility={props.switchPostVisibility}
      /> :  <MainPostFooterOpts
        postInfo={postInfo}
        floor={floor}
        showLikeList={showLikeList}
      />}
    </div>
    {showType === 'like' && <TabContentWrap arrowPos={arrowPos}>
      <LikeList uri={postInfo.uri} />
    </TabContentWrap>}

    {showType === 'reply' && <TabContentWrap arrowPos={arrowPos}>
      <ReplyList
        total={replyTotal}
        incrementalReplyTotal={incrementalReplyTotal}
        rootUri={rootUri}
        uri={postInfo.uri}
        sectionId={sectionId}
        replyComment={openReplyModal}
        componentRef={replyListRef}
      />
    </TabContentWrap>}
    {showType === 'donate' && <TabContentWrap arrowPos={arrowPos} arrowColor={'#E7E7E7'}>
      <TipDetailList uri={postInfo.uri} nsid={isNotMainPost ? 'comment' : 'post'} />
    </TabContentWrap> }
  </>
}

export default PostItemFooter;

function MainPostFooterOpts(props: {
  postInfo: PostItemType
  floor: number
  showLikeList: () => void
}) {
  const { postInfo, floor } = props;

  return <div className={S.mainPostRight}>
    <PostLike
      liked={postInfo.liked}
      likeCount={postInfo.like_count}
      uri={postInfo.uri}
      sectionId={postInfo.section_id}
      showLikeList={props.showLikeList}
    />
    <span className={'shrink-0'}>{floor}楼</span>
  </div>
}


function FooterOptions(props: {
  postInfo: PostItemType
  floor: number
  showLikeList: () => void
  switchPostVisibility: () => void
  reply: () => void
  editComment: () => void
  replyTotal: string
}) {
  const { postInfo, floor, reply, replyTotal, switchPostVisibility } = props;
  const { userProfile } = useCurrentUser()

  const canEdit = userProfile?.did === postInfo.author.did

  return <div className={`${S.rightPart} ${S.otherPost}`}>
    <div className={S.item}>
      <span className={S.opt}>{postInfo.edited ? `更新于 ${formatDate(postInfo.edited)}` : formatDate(postInfo.created)}</span>
      <span className={'shrink-0'}>{floor}楼</span>
    </div>
    <div className={cx(S.item)}>
      <PostLike
        liked={postInfo.liked}
        likeCount={postInfo.like_count}
        uri={postInfo.uri}
        sectionId={postInfo.section_id}
        showLikeList={props.showLikeList}
      />
      <SwitchPostHideOrOpen
        status={postInfo.is_disabled ? 'open' : 'hide'}
        uri={postInfo.uri}
        onConfirm={switchPostVisibility}
        nsid={'comment'}
      />
      <span
        className={S.reply}
        onClick={reply}
      >回复&nbsp;({replyTotal})</span>

      {canEdit && <span className={S.edit} onClick={props.editComment}>编辑</span>}
    </div>
  </div>
}