import {Extension} from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { handleImageUpload } from "@/lib/tiptap-utils";

export const EventHandler = Extension.create({
  name: 'eventHandler',

  addOptions() {
    return {
      userDid: ''
    }
  },

  addProseMirrorPlugins(this) {
    const self = this;
    return [
      new Plugin({
        key: new PluginKey('eventHandler'),
        props: {
          handleDrop(view, event, slice, moved) {
            if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) { // if dropping external files
              // console.log('event.dataTransfer.files[0]', event.dataTransfer.files[0])
              // handle the image upload
              // return true; // handled
            }
          },
          handlePaste(view, event, slice) {
            const item = event.clipboardData?.items[0];
            if (item?.type.indexOf("image") !== 0) {
              return false;
            }
            const file = item.getAsFile()
            console.log('file>>>', file)
            if (file) {
              handleImageUpload(file, self.options.userDid).then(url => {
                self.editor.commands.setImage({src: url})
              })
              return true
            }
          }
        },
      }),
    ]
  },
})