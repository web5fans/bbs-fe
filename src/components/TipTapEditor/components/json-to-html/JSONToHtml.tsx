'use client'

import { memo, useEffect, useMemo, useRef } from "react";
import {
  highlightWithLowlight
} from "../tiptap-node/code-block-node/code-block-node";
import parse, { domToReact } from 'html-react-parser';
import S from './index.module.scss'
import cx from "classnames";

const JSONToHtml = ({html, uri, htmlDidMount}: {html: string; uri?: string; htmlDidMount?: () => void}) => {
  const wrapRef = useRef<HTMLDivElement>(null)
  const wrapSizeRef = useRef<number | undefined>(undefined)

  const nodes = useMemo(() => {
    if (!html) return

    const { html: json, needParse } = highlightWithLowlight(html)

    if (!needParse) {
      return {
        json,
        needParse: false,
      }
    }

    const reactNode = parse(json, {
      replace(domNode) {
        if (domNode.name === 'pre') {
          const { children, attribs } = domNode;
          return <pre>
            <div className={S.header}>
              {attribs['data-language']}
              {/*<CopyText text={attribs['data-textcontent']} />*/}
            </div>
            {domToReact(children)}
          </pre>
        }
        return domNode
      }
    })

    return {
      node: reactNode,
      needParse: true
    };
  }, [html]);

  useEffect(() => {
    if (!wrapRef.current) return;

    const observer = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        if (!wrapRef.current) return;

        const entry = entries[0]
        const height = entry.contentRect.height
        if (wrapSizeRef.current) {
          htmlDidMount?.()
          observer.unobserve(wrapRef.current)
          return
        }
        wrapSizeRef.current = height
      })
    })

    observer.observe(wrapRef.current)

    return () => {
      if (!wrapRef.current) return
      observer.unobserve(wrapRef.current)
    }
  }, []);

  return <div ref={wrapRef}>
    {
      nodes?.needParse ? <div className={cx('tiptap ProseMirror', S.richText)}>{nodes.node}</div>
        : <div className={cx('tiptap ProseMirror', S.richText)} dangerouslySetInnerHTML={{ __html: nodes?.json || '' }} />
    }
  </div>
}

const MemoizedJSONToHtml = memo(JSONToHtml);

export default MemoizedJSONToHtml;