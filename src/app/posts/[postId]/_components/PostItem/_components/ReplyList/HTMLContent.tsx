import { useEffect, useRef, useState } from "react";
import { useBoolean } from "ahooks";
import cx from "classnames";
import S from "./index.module.scss";
import JSONToHtml from "@/components/TipTapEditor/components/json-to-html/JSONToHtml";

export default function HtmlContent(props: {html: string}) {
  const [showDetailVis, setShowDetailVis] = useState(false)
  const [expand, { toggle }] = useBoolean(false)

  const htmlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!htmlRef.current) return

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        if (!htmlRef.current) return
        const scrollHeight = htmlRef.current.scrollHeight
        const clientHeight = htmlRef.current.clientHeight
        if (scrollHeight > clientHeight) {
          setShowDetailVis(true)
        }
      })
    })
    observer.observe(htmlRef.current)

    return () => {
      if (!htmlRef.current) return
      observer.unobserve(htmlRef.current)
    }
  }, []);

  return <>
    <div
      className={cx(S.htmlContent, expand ? '!max-h-none' : '')}
      ref={htmlRef}
    >
      <JSONToHtml html={props.html} />
    </div>
    {showDetailVis && <p
      className={S.showDetail}
      onClick={toggle}
    >{expand ? <span className={S.packup}>收起</span> : '展开详情'}</p>}
  </>
}