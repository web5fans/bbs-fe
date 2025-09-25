
import { PostCommentReplyProvider } from "@/provider/PostReplyProvider";
import ReplyModal from "@/app/posts/[postId]/_components/ReplyModal";

export default function Layout({
   children,
 }: {
  children: React.ReactNode
}) {
  return <PostCommentReplyProvider>
    {children}
    <ReplyModal />
  </PostCommentReplyProvider>
}