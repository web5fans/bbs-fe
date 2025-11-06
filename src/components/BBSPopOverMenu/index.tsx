import { cloneElement, useEffect, useRef, useState } from "react";
import S from "./index.module.scss";
import cx from "classnames";

const BBSPopOverMenu = ({ menus, children }: {
  children: React.ReactNode;
  menus: {title: string; onClick: () => void}[]
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
    className={S.wrap}
    ref={ref}
  >
    {cloneElement(children, {
      onClick: () => setPopUpVis(!popUpVis)
    })}


    {popUpVis && <div className={cx(S.popup, !popUpVis && S.close)}>
      {menus.map(m => {
        return <div
          className={S.menuItem}
          onClick={() => {
            m.onClick()
            setPopUpVis(!popUpVis)
          }}
        >
          {m.title}
        </div>
      })}

    </div>}
  </div>
}

export default BBSPopOverMenu;