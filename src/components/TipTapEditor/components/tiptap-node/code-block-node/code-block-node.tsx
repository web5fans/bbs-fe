import './code-block-node.scss'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import React from 'react'

import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'

import { common, createLowlight } from 'lowlight'
import hastToHtml from "@/lib/hastToHTML";

// create a lowlight instance
const lowlight = createLowlight(common)

// you can also register individual languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

export function highlightWithLowlight(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const codeBlockNodes = doc.querySelectorAll('pre code');

  codeBlockNodes.forEach((block) => {
    const language = block.getAttribute('class')?.replace('language-', '');
    const code = block.textContent;

    let nodes;
    try {
      if (language && lowlight.registered(language)) {
        nodes = lowlight.highlight(language, code).children;
      } else {
        nodes = lowlight.highlightAuto(code).children;
      }
      block.innerHTML = hastToHtml(nodes)

      if (block.parentElement) {
        const parentNode = block.parentElement
        parentNode.setAttribute('data-language', language || 'auto')
        parentNode.setAttribute('data-textcontent', block.textContent)
      }

    } catch (e) {
      console.warn('Failed to highlight code:', e);
    }
  });

  return {
    html: doc.body.innerHTML,
    needParse: codeBlockNodes.length > 0,
  };
}

function CodeBlockNode({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}) {
  return <NodeViewWrapper className="code-block">
    <select
      contentEditable={false}
      defaultValue={defaultLanguage}
      onChange={event => updateAttributes({ language: event.target.value })}
    >
      <option value="null">auto</option>
      <option disabled>—</option>
      {extension.options.lowlight.listLanguages().map((lang, index) => (
        <option key={index} value={lang}>
          {lang}
        </option>
      ))}
    </select>
    <pre>
      <NodeViewContent as="code" />
    </pre>
  </NodeViewWrapper>
}

export const CodeBlockHighLight = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockNode)
  },
}).configure({ lowlight })