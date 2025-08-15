import { Extension } from "@tiptap/react";

const TAB_CHAR = "\u0009";

export const LiteralTab = Extension.create({
  name: 'literalTab',

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        return this.editor.commands.insertContent('\t')
      }
    }
  }

})