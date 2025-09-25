import { useRouter } from "next/navigation";
import S from "./index.module.scss";
import SectionEarth from "@/assets/posts/section.svg";
import ReadIcon from "@/assets/posts/read.svg";
import CommentIcon from "@/assets/posts/comment.svg";
import type { SectionItem } from "@/app/posts/utils";

export default function SectionItem(props: {
  section: SectionItem;
}) {
  const { section } = props;
  const router = useRouter()

  const href = `/section/${section.id}`

  return <div
    className={S.card}
    onClick={() => router.push(href)}
    onMouseEnter={() => router.prefetch(href)}
  >
    <div className={S.image}>
      <SectionEarth className={S.earth} />
    </div>
    <div className={S.content}>
      <p className={S.cardTitle}>{section.name}</p>
      <div className={S.info}>
        <p className={S.infoItem}>
          <ReadIcon />
          {section.post_count}
        </p>
        <p className={S.infoItem}>
          <CommentIcon />
          {section.comment_count}
        </p>
        {/*<p className={S.infoItem}>*/}
        {/*  <MoneyIcon />*/}
        {/*  666*/}
        {/*</p>*/}
      </div>
    </div>
  </div>
}