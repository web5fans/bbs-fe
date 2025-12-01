import S from './index.module.scss'
import Button from "@/components/Button";
import { usePathname, useRouter } from "next/navigation";
import { useRegisterPopUp } from "@/provider/RegisterPopUpProvider";
import { postsWritesPDSOperation } from "@/app/posts/utils";
import { handleToNickName } from "@/lib/handleToNickName";
import useUserInfoStore from "@/store/userInfo";

const MAIN_STATION_PATH = '/posts'

export const CompleteLeft = (props: {
  showExport: () => void
}) => {
  const { closeRegisterPop } = useRegisterPopUp()
  const pathname = usePathname()
  const router = useRouter()

  const { userInfo } = useUserInfoStore();

  const updateProfile = () => {
    if (!userInfo) return
    postsWritesPDSOperation({
      record: {
        $type: "app.actor.profile",
        displayName: handleToNickName(userInfo.handle),
        handle: userInfo.handle
      },
      did: userInfo.did,
      rkey: "self"
    })
  }

  const enterMainSite = () => {
    updateProfile()
    if (pathname === MAIN_STATION_PATH) {
      closeRegisterPop()
      return
    }
    router.replace(MAIN_STATION_PATH)
  }

  return <div className={S.wrap}>
      <img src={'/assets/login/shine.gif'} alt={''} className={S.gif} />
      <p className={S.title}>恭喜你，账号创建完成!</p>
    <div>
      <p className={S.info}>你的Web5去中心化身份DID已存储在区块链上</p>
      <p className={S.info}>未来可使用它穿梭于各类web5技术的网站</p>
    </div>

    <div className={S.footer}>
      <Button
        type={'primary'}
        className={S.button}
        onClick={props.showExport}
      >导出密钥信息</Button>
      <Button
        className={S.button}
        onClick={enterMainSite}
      >进入主站</Button>
    </div>
  </div>
}

