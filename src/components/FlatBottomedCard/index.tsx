import S from "./index.module.scss";
import cx from "classnames";

const FlatBottomedCard = (props: {
  children?: React.ReactNode;
  className?: string
}) => {

  return <div className={cx(S.content, props.className)}>
    <div className={S.bt} />
    <div className={S.br} />
    <div className={S.bb} />
    <div className={S.bl} />
    {props.children}
  </div>
}

export default FlatBottomedCard;