import S from './index.module.scss'
import InfoCard from "@/app/user-center/components/InfoCard";
import CopyText from "@/components/CopyText";
import cx from "classnames";
import Avatar from "@/components/Avatar";
import { UserProfileType } from "@/store/userInfo";
import utcToLocal from "@/lib/utcToLocal";

const UserInfo = ({ userProfile }: {
  userProfile?: UserProfileType
}) => {
  return <div className={S.container}>
    <div className={S.leftWrap}>
      <Avatar nickname={userProfile?.displayName} className={S.avatar} />
      <p className={S.userName}>{userProfile?.displayName}</p>
    </div>
    <div className={S.rightWrap}>
      <CardItem title={'Web5域名'} content={userProfile?.handle} />
      <CardItem title={'Web5 did'} content={userProfile?.did} />
      <div className={S.register}>
        <CardItem title={'注册排名'} content={'-'} showCopy={false} className={S.item} />
        <CardItem title={'注册时间'} content={utcToLocal(userProfile?.created, 'YYYY-MM-DD')} showCopy={false} className={S.item} />
      </div>
    </div>
  </div>
}

export default UserInfo;

function CardItem(props: {
  className?: string;
  title: string
  content: string
  showCopy?: boolean
}) {
  const { showCopy = true, title, content } = props;

  return <InfoCard className={cx(S.card, props.className)}>
    <div className={S.inner}>
      <div className={S.left}>
        <p className={S.title}>{title}</p>
        <p className={S.content}>{content}</p>
      </div>
      {showCopy && <CopyText
        text={content}
        className={S.copy}
      />}
    </div>
  </InfoCard>
}