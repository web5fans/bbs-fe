import ReplyModal from "./_components/ReplyModal";
import { PostCommentReplyProvider } from "@/provider/PostReplyProvider";

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