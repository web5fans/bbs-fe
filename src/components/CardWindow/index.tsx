import S from './index.module.scss'
import cx from "classnames";
import CloseIcon from '@/assets/window-close.svg'
import BreadCrumbs, { BreadCrumbsItemType } from "@/components/BreadCrumbs";

const CardWindow = (props: {
  children?: React.ReactNode;
  header?: string
  headerClick?: () => void
  wrapClassName?: string
  headerClassName?: string
  showCloseButton?: boolean
  onClose?: React.MouseEventHandler<HTMLDivElement>
  noInnerWrap?: boolean
  headerExtra?: React.ReactNode;
  breadCrumbs?: BreadCrumbsItemType[]
}) => {
  const { showCloseButton, headerClassName, noInnerWrap = false } = props;

  return <div className={cx(S.container, props.wrapClassName)}>
    {/*<div style={{position: 'relative'}}>*/}
      <div className={S.header} onClick={props.headerClick}>
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
          {/*<img src={'/assets/window-close.svg'} alt="close" />*/}
          <CloseIcon className={S.image} />
        </div>
        {!!props.header && <div className={cx(S.title, headerClassName)}>
          {props.header}
        </div>}

        {props.headerExtra}
        {props.breadCrumbs && <BreadCrumbs
          className={S.breadCrumb}
          breads={props.breadCrumbs}
        />}
      </div>

    {noInnerWrap ? props.children :<div className={S.content}>
      {props.children}
    </div>}
    {/*</div>*/}
  </div>
}

export default CardWindow;