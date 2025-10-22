import S from './index.module.scss'
import useCurrentUser from "@/hooks/useCurrentUser";
import MouseToolTip from "@/components/MouseToolTip";
import Button from "@/components/Button";
import { Icon } from "@/app/posts/_components/PublishPost";

const GoPublishPost = (props: {
  goPublish: () => void
}) => {
  const { hasLoggedIn, isWhiteUser } = useCurrentUser()


  return <MouseToolTip open={!isWhiteUser} message={hasLoggedIn && !isWhiteUser ? '暂时只有白名单用户可以发帖，可返回首页申请开通' : ''}>
    <Button
      type={'primary'}
      className={S.button}
      disabled={!isWhiteUser}
      onClick={props.goPublish}
      showClickAnimate={false}
    >
      <Icon />
      发布讨论
    </Button>
  </MouseToolTip>
}

export default GoPublishPost;