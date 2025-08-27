import S from "./index.module.scss";
import Button from "@/components/Button";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/posts/_components/PublishPost";

const PublishPostMobile = () => {
  const { isWhiteUser } = useCurrentUser()
  const router = useRouter()

  return <Button
    type={'primary'}
    className={S.button}
    disabled={!isWhiteUser}
    onClick={() => router.push('/posts/publish')}
  >
    <Icon className={S.icon} />
    发布讨论
  </Button>
}

export default PublishPostMobile;