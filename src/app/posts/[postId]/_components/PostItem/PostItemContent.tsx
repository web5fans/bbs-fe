import S from './index.module.scss'
import PostEdit from "@/app/posts/[postId]/_components/PostEdit";
import FeedStatistic from "@/components/FeedStatistic";
import JSONToHtml from "@/components/TipTapEditor/components/json-to-html/JSONToHtml";
import utcToLocal from "@/lib/utcToLocal";
import { usePostCommentReply } from "@/provider/PostReplyProvider";
import QuotePopUp from "./_components/QuotePopUp";
import { PostItemType } from "@/app/posts/[postId]/_components/PostItem/index";
import useCurrentUser from "@/hooks/useCurrentUser";

function formatDate(date: string) {
  return utcToLocal(date, 'YYYY/MM/DD HH:mm:ss')
}

const PostItemContent = (props: {
  postInfo: PostItemType
  rootUri: string
  refresh?: () => void
  scrollToTarget?: () => void
}) => {
  const { postInfo, rootUri, scrollToTarget } = props
  const sectionId = postInfo.section_id

  const { userProfile } = useCurrentUser()

  const { openModal } = usePostCommentReply()

  const quoteComment = (quoteContent: string) => {
    openModal({
      type: 'quote',
      postUri: rootUri,
      sectionId,
      quoteContent,
      refresh: props.refresh
    })
  }

  return <div>
    {postInfo.title && <>
      <div className={S.title}>
        <span className={S.titleInner}>{postInfo.title}</span>
        {userProfile?.did === postInfo.author.did && <PostEdit uri={postInfo.uri} />}
      </div>
      <div className={S.mainPostData}>
        <div className={S.statis}>
          {postInfo.section}
          <FeedStatistic
            visitedCount={postInfo.visited_count}
            commentCount={postInfo.comment_count}
          />
        </div>
        {postInfo.edited ? <span className={S.date}>更新于&nbsp;{formatDate(postInfo.edited)}</span>
          : <span className={S.date}>{formatDate(postInfo.created)}</span>}
      </div>
    </>}

    {
      rootUri === postInfo.uri ? <QuotePopUp quoteComment={quoteComment}>
        <JSONToHtml html={postInfo.text} htmlDidMount={scrollToTarget} uri={postInfo.uri} />
      </QuotePopUp> : <JSONToHtml html={postInfo.text} htmlDidMount={scrollToTarget} uri={postInfo.uri} />
    }
  </div>
}

export default PostItemContent;