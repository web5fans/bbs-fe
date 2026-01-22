import S from './index.module.scss'
import Avatar from "@/components/Avatar";
import CopyText from "@/components/CopyText";
import cx from "classnames";

const UserAvatarInfo = ({ author, className }: {
  author: {
    avatar?: string
    name?: string
    address?: string
  }
  className?: string
}) => {
  return <div className={cx(S.userInfo, className)}>
    <Avatar
      nickname={author.avatar || '?'}
      className={S.avatar}
    />
    <div className={S.info}>
      <p className={S.name}>{author.name || '--'}</p>
      {!author.address ? <span className={S.address}>--</span> : <CopyText
        text={author.address}
        ellipsis
        className={{ icon: S.copy, wrap: S.address }}
      />}
    </div>
  </div>
}

export default UserAvatarInfo;