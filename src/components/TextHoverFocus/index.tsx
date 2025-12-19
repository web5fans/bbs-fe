import S from './index.module.scss'
import cx from "classnames";

const TextHoverFocus = ({ text, classnames, ...rest }:{
  text: string;
  classnames?: {
    wrap?: string;
    inner?: string;
  }
} & React.HTMLAttributes<HTMLDivElement>) => {

  return <div {...rest} className={cx(S.wrap, classnames?.wrap)}>
    <div className={cx(S.inner, classnames?.inner)}>
      <span className={S.arrowR}>→</span>
      <span>{text}</span>
      <span className={S.arrowL}>←</span>
      <span className={S.divide} />
    </div>
  </div>
}

export default TextHoverFocus;