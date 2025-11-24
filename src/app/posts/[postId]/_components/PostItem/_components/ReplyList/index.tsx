import S from './index.module.scss'
import { useBoolean, useInfiniteScroll } from "ahooks";
import server from "@/server";
import PostLike from "@/app/posts/[postId]/_components/PostLike";
import useCurrentUser from "@/hooks/useCurrentUser";
import { usePostCommentReply } from "@/provider/PostReplyProvider";
import { Ref, useEffect, useImperativeHandle, useState } from "react";
import ArrowIcon from '@/assets/arrow-s.svg';
import ShowCreateTime from "./ShowCreateTime";
import HtmlContent from "./HTMLContent";
import Avatar from "@/components/Avatar";
import SwitchPostHideOrOpen from "@/app/posts/[postId]/_components/PostItem/_components/SwitchPostHideOrOpen";
import { eventBus } from "@/lib/EventBus";
import TipModal, { AuthorType } from "@/app/posts/[postId]/_components/PostItem/_components/Donate/TipModal";
import DonateIcon from '@/assets/posts/donate.svg'

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

  const { data: replyListInfo, loading, loadingMore, loadMore, noMore, reload, mutate } = useInfiniteScroll(async (prevData) => {

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

  useEffect(() => {
    const f = (uri: string) => {
      if (uri !== props.uri) return
      reload()
    }
    eventBus.subscribe('post-comment-reply-list-refresh', f)

    return () => {
      eventBus.unsubscribe('post-comment-reply-list-refresh', f)
    }
  }, []);

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
  const [disabled, setDisabled] = useState(false)

  const [donate, setDonate] = useState(0)

  useEffect(() => {
    setDisabled(replyItem.is_disabled)
    setDonate(Number(replyItem.tip_count))
  }, [replyItem]);

  const changeReplyVisible = () => {
    setDisabled(!disabled)
  }

  const changeDonate = (ckb: string) => {
    setDonate(v => v + Number(ckb))
  }

  const totalDonate = (donate / Math.pow(10, 8)).toFixed(2)

  return <div className={S.replyItem}>
    {disabled && <div className={S.mask} />}
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

      {/* 窗口小于1024px时，布局变化 */}
      <div className={S.right}>
        <SwitchPostHideOrOpen
          status={disabled ? 'open' : 'hide'}
          uri={replyItem.uri}
          onConfirm={changeReplyVisible}
          className={S.hideReply}
          nsid={'reply'}
        />
        <Donate uri={replyItem.uri} author={replyItem.author} changeDonate={changeDonate} />
      </div>
    </div>
    <div className={S.contentWrap}>
      <HtmlContent html={replyItem.text} />
      <div className={S.footer}>
        <div className={S.leftOpts}>
          <DonateIcon className={S.icon} />
          <span className={'tracking-normal'}>{totalDonate} CKB</span>
          <Donate
            uri={replyItem.uri}
            author={replyItem.author}
            changeDonate={changeDonate}
          />
        </div>
        <div className={S.rightOpts}>
          <PostLike
            liked={replyItem.liked}
            likeCount={replyItem.like_count}
            uri={replyItem.uri}
            sectionId={sectionId}
          />
          <SwitchPostHideOrOpen
            status={disabled ? 'open' : 'hide'}
            uri={replyItem.uri}
            onConfirm={changeReplyVisible}
            className={S.hideReply}
            nsid={'reply'}
          />
          <span className={S.reply} onClick={props.toReply}>回复</span>
        </div>
      </div>
    </div>
  </div>
}

function Donate(props: {
  author: AuthorType
  uri: string
  changeDonate: (ckb: string) => void
}) {
  const { changeDonate } = props;
  const [visible, { toggle, setTrue, setFalse }] = useBoolean(false)
  const { hasLoggedIn, userProfile } = useCurrentUser()
  return <>
    {hasLoggedIn && userProfile?.did !== props.author.did && <span
      className={S.donate}
      onClick={setTrue}
    >打赏</span>}

    <TipModal
      visible={visible}
      onClose={toggle}
      author={props.author}
      uri={props.uri}
      nsid={'app.bbs.reply'}
      onConfirm={(ckb) => {
        changeDonate(ckb)
        setFalse()
      }}
    />
  </>
}