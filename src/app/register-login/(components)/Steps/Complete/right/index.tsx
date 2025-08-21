import S from './index.module.scss'
import { useNickName } from "@/provider/RegisterNickNameProvider";
import CopyText from "@/components/CopyText";
import useCurrentUser from "@/hooks/useCurrentUser";

export const CompleteRight = () => {
  const { userProfile } = useCurrentUser();
  const { userHandle } = useNickName()

  return <div className={S.wrap}>
    <div className={S.card}>
      <span className={S.title}>BBS</span>
      <div className={S.inner}>
        <div className={S.top}>
          <Colon />
          web5 DID
          <Colon />
        </div>
        <p className={S.name}>{userHandle}</p>
        <p className={S.did}>
          {userProfile?.did}
          <CopyText text={userProfile?.did!} className={S.icon} />
        </p>
      </div>
    </div>
  </div>
}

function Colon() {
  return <div className={S.colon}>
    <span/>
    <span/>
  </div>
}

