import S from './index.module.scss'
import { useInfiniteScroll } from "ahooks";
import server from "@/server";
import PostLike from "@/app/posts/[postId]/_components/PostLike";
import useCurrentUser from "@/hooks/useCurrentUser";
import { usePostCommentReply } from "@/provider/PostReplyProvider";
import { Ref, useImperativeHandle } from "react";
import ArrowIcon from '@/assets/arrow-s.svg';
import ShowCreateTime from "./ShowCreateTime";
import HtmlContent from "./HTMLContent";
import Avatar from "@/components/Avatar";
import LockIcon from '@/assets/posts/op/lock.svg'
import SwitchPostHideOrOpen from "@/app/posts/[postId]/_components/PostItem/_components/SwitchPostHideOrOpen";

export type ReplyListRefProps = { reload: () => void }

const ReplyList = (props: {
  uri: string
  rootUri: string
  sectionId: string
  total: string
  changeTotal: (total: string) => void
  replyComment: () => void
  componentRef?: Ref<ReplyListRefProps>
}) => {
  const { userProfile } = useCurrentUser()

  const { openModal } = usePostCommentReply()

  const { data: replyListInfo, loading, loadingMore, loadMore, noMore, reload } = useInfiniteScroll(async (prevData) => {

    const { nextCursor } = prevData || {};

    const pagedData = await server('/reply/list', 'POST', {
      comment: props.uri,
      limit: 5,
      cursor: nextCursor,
      viewer: userProfile?.did
    })

    const { replies, cursor } = pagedData || {};

    return {
      list: replies ?? [],
      nextCursor: cursor,
    };
  }, {
    isNoMore: d => !d?.nextCursor,
    reloadDeps: [userProfile?.did]
  });

  useImperativeHandle(props.componentRef, () => {
    return {
      reload
    }
  })

  const reply = (info: any) => {
    openModal({
      type: 'reply',
      postUri: props.rootUri,
      commentUri: props.uri,
      toUserName: info.author.displayName,
      sectionId: props.sectionId,
      toDid: info.author.did,
      refresh: () => {
        reload()
        const total = Number(props.total) + 1
        props.changeTotal(`${total}`)
      }
    })
  }

  if (!replyListInfo) return null;

  return <div className={S.wrap}>
    {replyListInfo?.list.map(info => {
      return <ReplyItem
        replyItem={info}
        sectionId={props.sectionId}
        key={info.uri}
        toReply={() => reply(info)}
      />
    })}
    {props.total > 5 && (props.total !== `${replyListInfo.list.length}`) && <div
      className={S.load}
      onClick={loadMore}
    ><ArrowIcon />加载更多</div>}
    <div className={S.button} onClick={props.replyComment}>我也说一句</div>
  </div>
}

export default ReplyList;

function ReplyItem(props: {
  replyItem: any
  sectionId: string
  toReply: () => void
}) {
  const { replyItem, sectionId } = props;

  return <div className={S.replyItem}>
    <div className={S.mask} />
    <div className={S.title}>
      <div className={S.left}>
        <div className={S.avatarWrap}>
          <Avatar
            nickname={replyItem.author.displayName}
            className={S.avatar}
          />
        </div>
        <span className={'font-medium'}>{replyItem.author.displayName}</span>
        {
          !!replyItem.to?.displayName && <span>&nbsp;回复&nbsp;
            <span className={'font-medium'}>{replyItem.to?.displayName}</span></span>
        }
        <ShowCreateTime created={replyItem.created} />
      </div>

      <div className={S.right}>
        {/*<SwitchPostHideOrOpen status={'open'} className={S.hideComment} />*/}
        <span>打赏</span>
      </div>
    </div>
    <HtmlContent html={replyItem.text} />
    <div className={S.footer}>
      <PostLike
        liked={replyItem.liked}
        likeCount={replyItem.like_count}
        uri={replyItem.uri}
        sectionId={sectionId}
      />
      <SwitchPostHideOrOpen status={'hide'} />
      <span className={S.reply} onClick={props.toReply}>回复</span>
    </div>
  </div>
}