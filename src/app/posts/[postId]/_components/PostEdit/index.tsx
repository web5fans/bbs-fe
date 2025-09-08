import S from './index.module.scss'
import EditIcon from '@/assets/posts/edit.svg';
import { postUriToHref } from "@/lib/postUriHref";
import Link from "next/link";

const PostEdit = (props: { uri: string }) => {

  const url = `/posts/edit/${postUriToHref(props.uri)}`;
  return <Link href={url} className={S.wrap}>
  <EditIcon className={S.icon} />
    编辑
  </Link>
}

export default PostEdit;