
import { PostCommentReplyProvider } from "@/provider/PostReplyProvider";

export default function Layout({
   children,
 }: {
  children: React.ReactNode
}) {
  return <PostCommentReplyProvider>
    {children}
  </PostCommentReplyProvider>
}