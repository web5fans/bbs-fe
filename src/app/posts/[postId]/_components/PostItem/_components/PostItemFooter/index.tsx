import S from './index.module.scss'
import PostLike from "@/app/posts/[postId]/_components/PostLike";
import { CSSProperties, useEffect, useRef, useState } from "react";
import LikeList, { LikeListRef } from "../LikeList";
import { usePostCommentReply } from "@/provider/PostReplyProvider";
import TabWrap from "../TabWrap";
import ReplyList, { ReplyListRefProps } from "../ReplyList";
import utcToLocal from "@/lib/utcToLocal";
import Donate from "../Donate";
import { PostItemType } from "@/app/posts/[postId]/_components/PostItem/index";
import DonateDetailList from "@/app/posts/[postId]/_components/PostItem/_components/DonateDetailList";

function formatDate(date: string) {
  return utcToLocal(date, 'YYYY/MM/DD HH:mm:ss')
}

type ShowTypeType = 'like' | 'reply' | 'donate' | undefined

const PostItemFooter = (props: {
  postInfo: PostItemType
  floor: number
  rootUri: string
  refresh?: () => void
}) => {
  const { postInfo, floor, rootUri } = props
  const sectionId = postInfo.section_id

  const [ showType, setShowType ] = useState<ShowTypeType>(undefined)
  const [replyTotal, setReplyTotal] = useState('0')

  const likeListRef = useRef<LikeListRef>(null)
  const replyListRef = useRef<ReplyListRefProps>(null)

  const parentRef = useRef<HTMLDivElement>(null)

  const [arrowPos, setArrowPos] = useState<{ left: string } | undefined>(undefined)

  const { openModal } = usePostCommentReply()

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

    if (!postInfo.reply_count || postInfo.reply_count === '0') {

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

  const openReplyModal = (obj?: CSSProperties) => {
    openModal({
      type: 'reply',
      postUri: rootUri,
      commentUri: postInfo.uri,
      toUserName: postInfo.author.displayName,
      sectionId,
      refresh: () => {
        props.refresh?.()
        replyListRef.current?.reload()
      },
      rect: obj
    })
  }

  const showLikeList = () => {
    changeShowType('like')
  }

  const reloadLikeList = () => {
    if (showType === 'like') {
      likeListRef.current?.reloadLikeList()
    }
  }

  useEffect(() => {
    setReplyTotal(postInfo.reply_count || '0')
  }, [postInfo.reply_count]);

  const noMainPost = rootUri !== postInfo.uri

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
      <Donate showList={() => changeShowType('donate')} />
      {noMainPost ? <FooterOptions
        postInfo={postInfo}
        floor={floor}
        showLikeList={showLikeList}
        reloadLikeList={reloadLikeList}
        reply={reply}
        replyTotal={replyTotal}
      /> :  <MainPostFooterOpts
        postInfo={postInfo}
        floor={floor}
        showLikeList={showLikeList}
        reloadLikeList={reloadLikeList}
      />}
    </div>
    {showType === 'like' && <TabWrap arrowPos={arrowPos}>
      <LikeList uri={postInfo.uri} componentRef={likeListRef} />
    </TabWrap>}

    {showType === 'reply' && <TabWrap arrowPos={arrowPos}>
      <ReplyList
        total={replyTotal}
        changeTotal={setReplyTotal}
        rootUri={rootUri}
        uri={postInfo.uri}
        sectionId={sectionId}
        replyComment={openReplyModal}
        componentRef={replyListRef}
      />
    </TabWrap>}
    {showType === 'donate' && <TabWrap arrowPos={arrowPos} arrowColor={'#E7E7E7'}>
      <DonateDetailList />
    </TabWrap> }
  </>
}

export default PostItemFooter;

function MainPostFooterOpts(props: {
  postInfo: PostItemType
  floor: number
  showLikeList: () => void
  reloadLikeList: () => void
}) {
  const { postInfo, floor } = props;

  return <div className={S.rightPart}>
    <PostLike
      liked={postInfo.liked}
      likeCount={postInfo.like_count}
      uri={postInfo.uri}
      sectionId={postInfo.section_id}
      showLikeList={props.showLikeList}
      reloadLikeList={props.reloadLikeList}
    />
    <span className={'shrink-0'}>{floor}楼</span>
  </div>
}


function FooterOptions(props: {
  postInfo: PostItemType
  floor: number
  showLikeList: () => void
  reloadLikeList: () => void
  reply: () => void
  replyTotal: string
}) {
  const { postInfo, floor, reply, replyTotal } = props;

  return <div className={`${S.rightPart} ${S.otherPost}`}>
    <div className={S.item}>
      <PostLike
        liked={postInfo.liked}
        likeCount={postInfo.like_count}
        uri={postInfo.uri}
        sectionId={postInfo.section_id}
        showLikeList={props.showLikeList}
        reloadLikeList={props.reloadLikeList}
      />
      <span
        className={S.reply}
        onClick={reply}
      >回复&nbsp;({replyTotal})</span>
    </div>

    <div className={S.item}>
      <span className={S.opt}>{formatDate(postInfo.created)}</span>
      <span className={'shrink-0'}>{floor}楼</span>
    </div>
  </div>
}