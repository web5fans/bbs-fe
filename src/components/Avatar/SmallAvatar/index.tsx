import { useMemo } from "react";
import S from "./index.module.scss";
import CircleInner from "@/assets/avatar/small/inner.svg";
import CircleOuter from "@/assets/avatar/small/outer.svg";
import { toHashCode } from "@/components/Avatar";

const colorsNum = 12

const SmallAvatar = (props: {
  nickname: string,
  className?: string
}) => {
  const { nickname = '' } = props;

  const hash = useMemo(() => {
    if (!nickname) return null;
    return Math.abs(toHashCode(nickname)) % colorsNum
  }, [nickname])

  if (!hash && hash !== 0) return null;

  return <div
    className={`${S.wrap} ${props.className} ${(hash || hash === 0) ? S[`color${hash + 1}`] : ''}`}
  >
    <CircleInner className={S.circleInner} />
    <CircleOuter className={S.circle} />
    <span className={S.nick}>{nickname[0]}</span>
  </div>
}

export default SmallAvatar;