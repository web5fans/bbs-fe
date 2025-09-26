import S from './index.module.scss'
import PostEdit from "@/app/posts/[postId]/_components/PostEdit";
import FeedStatistic from "@/components/FeedStatistic";
import JSONToHtml from "@/components/TipTapEditor/components/json-to-html/JSONToHtml";
import utcToLocal from "@/lib/utcToLocal";
import { usePostCommentReply } from "@/provider/PostReplyProvider";
import QuotePopUp from "./_components/QuotePopUp";
import { PostItemType } from "@/app/posts/[postId]/_components/PostItem/index";

function formatDate(date: string) {
  return utcToLocal(date, 'YYYY/MM/DD HH:mm:ss')
}

const PostItemContent = (props: {
  postInfo: PostItemType
  isAuthor?: boolean
  rootUri: string
  refresh?: () => void
}) => {
  const { postInfo, rootUri } = props
  const sectionId = postInfo.section_id

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
        {props.isAuthor && <PostEdit uri={postInfo.uri} />}
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
        <JSONToHtml html={postInfo.text} />
      </QuotePopUp> : <JSONToHtml html={postInfo.text} />
    }
  </div>
}

export default PostItemContent;