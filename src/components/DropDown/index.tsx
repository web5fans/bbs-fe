import { cloneElement, JSX, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import S from "./index.module.scss";
import cx from "classnames";

export type DropDownRefType = { close: () => void }

const ExistDidPopUp = (props: {
  children: JSX.Element;
  popItems: {name: string | React.ReactNode; onClick: () => void}[]
  classNames?: {
    popOver?: string;
    popItem?: string
  },
  eleRef?: Ref<DropDownRefType>
}) => {
  const { classNames } = props;
  const [popUpVis, setPopUpVis] = useState(false);

  const ref= useRef<HTMLDivElement>(null)

  useImperativeHandle(props.eleRef, () => {
    return {
      close: () => {
        setPopUpVis(false);
      }
    }
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setPopUpVis(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return <div
    className={'relative'}
    ref={ref}
  >
    {cloneElement(props.children, {
      onClick: () => setPopUpVis(!popUpVis)
    })}

    <div className={cx(S.popup, classNames?.popOver, !popUpVis && S.close)}>
      {props.popItems.map(item => (
        <div
          className={cx(S.menuItem, classNames?.popItem)}
          onClick={() => {
            item.onClick();
            setPopUpVis(false)
          }}
        >
          {item.name}
        </div>
      ))}
    </div>
  </div>
}

export default ExistDidPopUp;