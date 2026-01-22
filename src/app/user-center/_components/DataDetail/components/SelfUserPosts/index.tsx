import S from './index.module.scss'
import Button from "@/components/Button";
import UserPosts from "../UserPosts";
import { useRouter } from "next/navigation";
import { useBoolean } from "ahooks";
import DraftModal from "@/app/posts/publish/(components)/DraftModal";
import { postUriToHref } from "@/lib/postUriHref";

const SelfUserPosts = ({ did, scrollToTop }: { did: string; scrollToTop: () => void }) => {
  const router = useRouter()

  const [draftModalVis, setDraftModalVis] = useBoolean(false)

  return <div className={S.wrap}>
    <div className={'flex justify-end'}>
      <Button className={S.button} onClick={setDraftModalVis.setTrue}>草稿箱</Button>
    </div>
    <UserPosts did={did} scrollToTop={scrollToTop} />

    <DraftModal
      visible={draftModalVis}
      onClose={setDraftModalVis.setFalse}
      continueEdit={(post) => {
        router.push(`/posts/publish?section=${post.sectionId}&draft=${postUriToHref(post.uri)}`)
      }}
    />
  </div>
}

export default SelfUserPosts;