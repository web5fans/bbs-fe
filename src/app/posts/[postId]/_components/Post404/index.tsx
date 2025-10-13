import CardWindow from "@/components/CardWindow";
import Button from "@/components/Button";
import S from './index.module.scss'
import FaceIcon from '@/assets/login/multiDid/face.svg'
import { useRouter } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useMemo } from "react";
import { SectionItem } from "@/app/posts/utils";

const Post404 = ({ originPost, sectionInfo, children }: {
  originPost: { reasons_for_disabled?: string; [key: string]: any }
  sectionInfo?: SectionItem
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { userProfile } = useCurrentUser()

  const isAdmin = useMemo(() => {
    if (!sectionInfo || !userProfile) return false;
    const admins = sectionInfo.administrators.map(i => i.did)
    return admins?.includes(userProfile.did)
  }, [sectionInfo, userProfile])

  if (originPost.reasons_for_disabled && !isAdmin) {
    return <CardWindow wrapClassName={S.wrap}>
      <div className={S.content}>
        <FaceIcon className={S.faceIcon} />
        <p className={S.tips}>Ops,该帖子已被管理员或版主取消公开，原因：{originPost.reasons_for_disabled}</p>
        <Button type={'primary'} className={S.button} onClick={() => router.replace('/posts')}>进主站看看</Button>
      </div>
    </CardWindow>
  }

  return children
}

export default Post404;