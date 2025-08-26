'use client'

import { useMemo } from "react";
import {
  highlightWithLowlight
} from "../tiptap-node/code-block-node/code-block-node";
import parse, { domToReact } from 'html-react-parser';
import S from './index.module.scss'
import CopyText from "@/components/CopyText";
import cx from "classnames";

const JSONToHtml = ({html}: {html: string}) => {

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

  if (nodes?.needParse) {
    return <div className={cx('tiptap ProseMirror', S.richText)}>{nodes.node}</div>
  }

  return <div className={cx('tiptap ProseMirror', S.richText)} dangerouslySetInnerHTML={{ __html: nodes?.json || '' }} />
}

export default JSONToHtml;