import S from './index.module.scss'
import { useNickName } from "@/provider/RegisterNickNameProvider";
import CopyText from "@/components/CopyText";
import useUserInfoStore from "@/store/userInfo";

export const CompleteRight = () => {
  const { userInfo } = useUserInfoStore();
  const { userHandle } = useNickName()

  return <div className={S.wrap}>
    <div className={S.bgWrap}>
      <img
        src={'/assets/login/byte-static-m.png'}
        alt=""
        className={S.bgImage}
      />
      <img
        src={'/assets/login/byte-m.gif'}
        alt=""
        className={S.gif}
      />
    </div>
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
          {userInfo?.did}
          <CopyText text={userInfo?.did!} className={S.icon} />
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

