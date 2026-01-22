import {Extension} from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { getImagesDimensions, handleImageUpload } from "@/lib/tiptap-utils";
import { showGlobalToast } from "@/provider/toast";

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
            const enableTypes = "image/png,image/jpg,image/jpeg,image/webp,image/gif".split(',')

            if (!enableTypes.includes(item?.type)) {
              showGlobalToast({
                title: '文件类型只支持png,jpg,jpeg,webp,gif',
                icon: 'error',
              })
              return false
            }
            const file = item.getAsFile()
            if (file) {
              handleImageUpload(file, self.options.userDid).then(url => {
                getImagesDimensions(file).then(({ width, height }) => {
                  self.editor.commands.setImage({src: url, style: `width: 100%; max-width: ${width}px; aspect-ratio: ${width}/${height};`})
                })
              })
              return true
            }
          }
        },
      }),
    ]
  },
})