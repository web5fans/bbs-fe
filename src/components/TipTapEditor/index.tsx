"use client"

import * as React from "react"
import { Editor, EditorContent, EditorContext, generateHTML, generateJSON, useEditor } from "@tiptap/react"
// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Underline } from "@tiptap/extension-underline"
import { Placeholder } from "@tiptap/extension-placeholder"

// --- Custom Extensions ---
import { Link } from "@/components/TipTapEditor/components/tiptap-extension/link-extension"
import { CustomImage } from "@/components/TipTapEditor/components/tiptap-node/image-node/image-node-extension"
import { Selection } from "@/components/TipTapEditor/components/tiptap-extension/selection-extension"
import { TrailingNode } from "@/components/TipTapEditor/components/tiptap-extension/trailing-node-extension"

// --- UI Primitives ---
import { Button } from "@/components/TipTapEditor/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/TipTapEditor/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/TipTapEditor/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/TipTapEditor/components/tiptap-node/image-upload-node/image-upload-node-extension"
import "@/components/TipTapEditor/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/TipTapEditor/components/tiptap-node/list-node/list-node.scss"
import "@/components/TipTapEditor/components/tiptap-node/image-node/image-node.scss"
import "@/components/TipTapEditor/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/TipTapEditor/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/TipTapEditor/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/TipTapEditor/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/TipTapEditor/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/TipTapEditor/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/TipTapEditor/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/TipTapEditor/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/TipTapEditor/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/TipTapEditor/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/TipTapEditor/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/TipTapEditor/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/TipTapEditor/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/TipTapEditor/components/tiptap-icons/link-icon"

// --- Hooks ---
// import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
// import { ThemeToggle } from "@/components/TipTapEditor/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

import { LiteralTab } from "@/components/TipTapEditor/components/tiptap-extension/literal-tab";

import S from './index.module.scss'
import { CodeBlockHighLight } from "@/components/TipTapEditor/components/tiptap-node/code-block-node/code-block-node";
import { JSONContent, Content, HTMLContent } from "@tiptap/core";
import cx from "classnames";
import { Ref, useEffect, useImperativeHandle, useMemo, useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { EventHandler } from "@/components/TipTapEditor/eventHandler";

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => {
  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
        <ListDropdownMenu types={["bulletList", "orderedList"]} />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" tooltip={'加粗'} />
        <MarkButton type="italic" tooltip={'斜体'} />
        <MarkButton type="strike" tooltip={'删除线'} />
        {/*<MarkButton type="code" tooltip={'代码'} />*/}
        <MarkButton type="underline" tooltip={'下划线'} />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" tooltip={'上标'} />
        <MarkButton type="subscript" tooltip={'下标'} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="图片" />
      </ToolbarGroup>

      <Spacer />

      {/*{isMobile && <ToolbarSeparator />}*/}

      {/*<ToolbarGroup>*/}
      {/*  <ThemeToggle />*/}
      {/*</ToolbarGroup>*/}
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export type EditorUpdateData = { json: JSONContent, html: string, text: string }

export type EditorRefType = {
  clearContent: () => void
  setContent: (newContent: string) => void
  focus: () => void
  editor?: Editor | null
}

type TipTapEditorProps = {
  disabled?: boolean
  onUpdate?: (obj: EditorUpdateData) => void
  editorWrapClassName?: string
  editorClassName?: string
  editable?: boolean
  ref?: Ref<EditorRefType>
}

export default function TipTapEditor(props: TipTapEditorProps) {
  const { editable = true } = props;
  const isMobile = false
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main")
  const toolbarRef = React.useRef<HTMLDivElement>(null)

  const { userProfile } = useCurrentUser()

  useImperativeHandle(props.ref, () => {
    return {
      setContent: (text: string) => editor?.commands.setContent(text),
      clearContent: () => {
        editor?.commands.clearContent();
        editor?.commands.focus()
      },
      focus: () => editor?.commands.focus(),
      editor
    }
  })

  const extensions = useMemo(() => {
    return [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      LiteralTab,
      Highlight.configure({ multicolor: true }),
      CustomImage,
      Typography,
      Superscript,
      Subscript,
      CodeBlockHighLight,
      EventHandler.configure({ userDid: userProfile?.did! }),

      Selection,
      ImageUploadNode.configure({
        accept: "image/png,image/jpg,image/jpeg,image/webp,image/gif",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: (file, abortSignal) => {
          return handleImageUpload(file, userProfile?.did!)
        },
        onError: (error) => console.error("Upload failed:", error),
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "输入正文......",
      })
    ]
  }, [userProfile?.did])

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
      },
    },
    editable,
    extensions,
    onUpdate: ({ editor: editorProp  }) => {
      // console.log('editor', editorProp);
      const json = editorProp.getJSON()
      const html = editorProp.getHTML()
      const text = editorProp.getText()

      props.onUpdate?.({
        json,
        html,
        text: text.trim(),
      })
      // console.log('text', text, text.length);
    },
  })

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className={cx(S.wrap, props.editorWrapClassName)}>
        <Toolbar ref={toolbarRef} className={'relative'}>
          {props.disabled && <div className={S.disabledToolBar} />}
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className={cx(S.editor, props.editorClassName)}
        />
      </div>
    </EditorContext.Provider>
  )
}
