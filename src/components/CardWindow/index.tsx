import S from './index.module.scss'
import cx from "classnames";

const CardWindow = (props: {
  children?: React.ReactNode;
  header?: string
  wrapClassName?: string
  headerClassName?: string
  showCloseButton?: boolean
  onClose?: () => void
  noInnerWrap?: boolean
  headerExtra?: React.ReactNode;
}) => {
  const { showCloseButton, headerClassName, noInnerWrap = false } = props;

  return <div className={cx(S.container, props.wrapClassName)}>
    {/*<div style={{position: 'relative'}}>*/}
      <div className={S.header}>
        <div style={{width: '100%'}}>
          {new Array(6).fill(0).map((_, i) => (<div
            key={i}
            className={S.line}
          />))}
        </div>
        <div
          className={cx(S.close, showCloseButton ? '' : '!hidden')}
          onClick={props.onClose}
        >
          <img src={'/assets/window-close.svg'} alt="close" />
        </div>
        <div className={cx(S.title, headerClassName)}>
          {props.header}
        </div>

        {props.headerExtra}
      </div>

    {noInnerWrap ? props.children :<div className={S.content}>
      {props.children}
    </div>}
    {/*</div>*/}
  </div>
}

export default CardWindow;