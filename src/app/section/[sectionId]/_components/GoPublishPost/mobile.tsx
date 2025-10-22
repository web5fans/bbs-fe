import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import S from "@/app/posts/_components/PublishPost/mobile/index.module.scss";
import { Icon } from "@/app/posts/_components/PublishPost";

const GoPublishPostMobile = (props: {
  goPublish: () => void
}) => {
  const { isWhiteUser } = useCurrentUser()

  return <Button
    type={'primary'}
    className={S.button}
    disabled={!isWhiteUser}
    onClick={props.goPublish}
  >
    <Icon className={S.icon} />
    发布讨论
  </Button>
}

export default GoPublishPostMobile;