import S from "./index.module.scss";

export const DotLoading = (props: {
  className?: string;
}) => {
  return <div className={`${S.dotLoading} ${props.className}`}>
    <span>.</span>
    <span className={S.dot2}>.</span>
    <span>.</span>
  </div>
}