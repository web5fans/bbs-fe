import cx from "classnames";
import { CircleLoading } from "@/components/Loading/circle";

export function Loading({ className, style, iconClass }: { className?: string; style?: React.CSSProperties; iconClass?: string }){
  return <div className={cx('flex items-center justify-center', className)} style={style}>
    <CircleLoading className={iconClass} />
  </div>
}