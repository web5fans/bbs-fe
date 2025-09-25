import { useEffect, useRef } from "react";
import S from "./index.module.scss";
import TabArrowDown from "@/assets/posts/tab-arrow.svg";

export default function TabWrap(props: {
  children?: React.ReactNode;
  arrowPos: {left: string} | undefined
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const arrowRef= useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        if (!arrowRef.current || !wrapRef.current) return;
        const isArrowShow = arrowRef.current?.style.display !== 'none';

        if (isArrowShow) {
          observer.unobserve(wrapRef.current)
          return;
        } else {
          if (wrapRef.current.clientHeight > 0) {
            arrowRef.current.style.display = 'block';
            arrowRef.current.style.left = props.arrowPos.left;
          }
        }
      })
    })
    observer.observe(wrapRef.current)

    return () => {
      if (!wrapRef.current) return;
      observer.unobserve(wrapRef.current)
    }

  }, []);

  return <div ref={wrapRef} className={'relative'}>
    <div
      ref={arrowRef}
      className={S.tabArrow}
      style={{ display: 'none' }}
    ><TabArrowDown className={S.arrow} /></div>
    {props.children}
  </div>
}