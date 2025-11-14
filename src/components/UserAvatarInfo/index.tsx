import S from './index.module.scss'
import Avatar from "@/components/Avatar";
import CopyText from "@/components/CopyText";

const UserAvatarInfo = ({ author }: {
  author: {
    avatar: string
    name: string
    address: string
  }
}) => {
  return <div className={S.userInfo}>
    <Avatar
      nickname={author.avatar}
      className={S.avatar}
    />
    <div className={S.info}>
      <p className={S.name}>{author.name}</p>
      <CopyText
        text={author.address}
        ellipsis
        className={{ icon: S.copy, wrap: S.address }}
      />
    </div>
  </div>
}

export default UserAvatarInfo;