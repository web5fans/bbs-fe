import S from './index.module.scss'
import { useEffect, useRef } from "react";
import QuoteIcon from '@/assets/posts/quote.svg'
import CopyIcon from '@/assets/copy.svg'
import { useToast } from "@/provider/toast";
import useCurrentUser from "@/hooks/useCurrentUser";

type QuotePopupProps = {
  children: React.ReactNode
  quoteComment: (quote: string) => void
}

let timeout: NodeJS.Timeout

const QuotePopUp = (props: QuotePopupProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const contentHtmlRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const selectionRange = useRef<Range[]>([])

  const selectionText = useRef('')

  const toast = useToast()

  const { isWhiteUser } = useCurrentUser()

  const copy = async (event) => {
    event.stopPropagation();

    await navigator.clipboard.writeText(selectionText.current);

    toast({
      title: '已复制到剪贴板',
      icon: 'success'
    })
  }

  const comment = () => {
    props.quoteComment(selectionText.current)
  }

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection) return
    selectionText.current = selection.toString()
    // 保存所有范围
    for (let i = 0; i < selection.rangeCount; i++) {
      selectionRange.current.push(selection.getRangeAt(i).cloneRange());
    }
  }

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection) return
    selection.removeAllRanges();

    // 恢复所有范围
    selectionRange.current.forEach(range => {
      selection.addRange(range.cloneRange());
    });
  }

  const showPopup = (action: 'mouse' | 'touch' = 'mouse') => {
    const selection = window.getSelection();
    if (!selection) return;
    if (contentHtmlRef.current && contentHtmlRef.current.contains(selection.anchorNode)) {
      const rangeText = selection.toString()
      if (rangeText && !selection.isCollapsed) {

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const parentNode = parentRef.current.getBoundingClientRect();

        popupRef.current.style.display = 'flex';
        popupRef.current.style.left = `${rect.left - parentNode.left}px`

        if (action === 'mouse') {
          const top = rect.top - parentNode.top
          popupRef.current.style.top = `${top}px`
        } else {
          popupRef.current.style.transform = 'none';
          const bottom = rect.bottom - parentNode.bottom
          popupRef.current.style.top = `${bottom + 4}px`
        }


        saveSelection()
      } else {
        popupRef.current.style.display = 'none';
      }
    }
  }

  useEffect(() => {
    const f = () => {
      const selection = window.getSelection();
      if (!selection) return;
      if (contentHtmlRef.current && !contentHtmlRef.current.contains(selection.anchorNode)) {
        popupRef.current.style.display = 'none';
      }
    }
    const listener = () => {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(f, 0)
    }

    document.addEventListener("mouseup", listener)
    document.addEventListener("touchend", listener)

    return () => {
      document.removeEventListener("mouseup", listener)
      document.removeEventListener("touchend", listener)
    }
  }, []);

  return <div className={'relative'} ref={parentRef}>
    <div
      ref={contentHtmlRef}
      onMouseDown={() => {
        const isOpen = getComputedStyle(popupRef.current).display !== 'none';
        if (isOpen) {
          window.getSelection()?.removeAllRanges();
          popupRef.current.style.display = 'none';
        }
      }}
      onMouseUp={() => showPopup()}
      onTouchEnd={() => showPopup('touch')}
    >
      {props.children}
    </div>
    <div
      ref={popupRef}
      className={S.popup}
      onTouchStart={e => {
        e.preventDefault()
      }}
      onMouseDown={e => {
        e.preventDefault();
      }}
    >
      {isWhiteUser && <div
        className={S.item}
        onClick={comment}
      >
        <QuoteIcon className={S.icon} />
        引用回复
      </div>}
      <div className={S.item} onClick={copy}>
        <CopyIcon className={S.icon} />
        复制内容
      </div>
    </div>
  </div>
}

export default QuotePopUp;