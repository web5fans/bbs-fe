import { cloneElement, JSX, useEffect, useRef, useState } from "react";
import S from "./index.module.scss";
import cx from "classnames";

const ExistDidPopUp = (props: {
  children: JSX.Element;
  popItems: {name: string; onClick: () => void}[]
}) => {
  const [popUpVis, setPopUpVis] = useState(false);

  const ref= useRef<HTMLDivElement>(null)

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

    <div className={cx(S.popup, !popUpVis && S.close)}>
      {props.popItems.map(item => (
        <div
          className={S.menuItem}
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