import S from "./index.module.scss";
import { PostItemType } from "@/app/posts/[postId]/_components/PostItem/index";
import Avatar from "@/components/Avatar";
import { useRouter } from "next/navigation";
import cx from "classnames";
import { useEffect, useState } from "react";
import identityLabel from "@/lib/identityLabel";
import { formatLinkParam } from "@/lib/postUriHref";

const PostItemUserMobile = ({ post, isOriginPoster }: { post: PostItemType; isOriginPoster?: boolean }) => {
  const [_, setRefresh] = useState(0)
  const router = useRouter()

  const href = `/user-center/${formatLinkParam(post.author?.did)}`

  const nickname = post.author?.displayName

  const goUserCenter = (author) => {
    if (!author.handle) return
    router.push(href)
  }

  const name = !post.author?.handle ? '已注销' : nickname

  useEffect(() => {
    const f = () => {
      requestAnimationFrame(() => {
        setRefresh(v => v + 1)
      })
    }

    window.addEventListener('resize', f);

    return () => {
      window.removeEventListener('resize', f);
    }

  }, []);

  if (window.innerWidth > 768) return null

  return <div
    className={S.wrap}
    onClick={() => goUserCenter(post.author)}
    onMouseEnter={() => router.prefetch(href)}
  >
    <div className={'flex items-center'}>
      <div className={cx(S.avatarWrap, !isOriginPoster && S.normal)}>
        <Avatar nickname={nickname} className={S.avatar} />
        <img
          src={'/assets/poster.png'}
          alt=""
          className={S.poster}
        />
      </div>
      <div className={S.postInfo}>
        <p>
          {name}
          {post.author?.tags && <>&nbsp;({identityLabel(post.author?.tags)})</>}
        </p>
        <p>发帖数量: {post.author?.post_count}</p>
      </div>
    </div>
    <div className={S.divide} />
  </div>
}

export default PostItemUserMobile;