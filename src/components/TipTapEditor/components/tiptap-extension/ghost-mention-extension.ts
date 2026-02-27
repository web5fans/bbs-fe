import { Extension, nodeInputRule } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { isNodeSelection } from "@tiptap/react";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import ImageUploadNode from "../tiptap-node/image-upload-node/image-upload-node-extension";

export interface GhostMentionOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ghostMention: {
      setGhostMention: (attributes?: { id: string }) => ReturnType
    }
  }
}

export const GhostMention = Extension.create<GhostMentionOptions>({
  name: 'ghostMention',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'ghost-mention',
      },
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph'],
        attributes: {
          isGhostMention: {
            default: false,
            parseHTML: element => element.getAttribute('data-ghost-mention') === 'true',
            renderHTML: attributes => {
              if (!attributes.isGhostMention) {
                return {}
              }

              return {
                'data-ghost-mention': 'true',
              }
            },
          },
        },
      },
    ]
  },

  addProseMirrorPlugins() {
    const { editor } = this
    const plugin = new Plugin({
      key: new PluginKey('ghostMention'),
      appendTransaction: (transactions, oldState, newState) => {
        const { tr } = newState
        let modified = false

        // Find all text nodes
        newState.doc.descendants((node, pos) => {
          if (!node.isText) return

          const text = node.text || ''
          const regex = /@ghost\b/g
          let match

          // Check if we have any matches
          while ((match = regex.exec(text)) !== null) {
            const from = pos + match.index
            const to = from + match[0].length

            // Apply the ghost mention
            // tr.replaceWith(
            //   from,
            //   to,
            //   editor.schema.nodes.image.create({ src: 'dddd' })
            // )
            tr.addMark(
              from,
              to,
              editor.schema.mark('link', { href: 'www.baidu.com' })
            )
            modified = true
          }
        })

        return modified ? tr : null
      },
    })

    return [
      plugin
    ]
  },
})
