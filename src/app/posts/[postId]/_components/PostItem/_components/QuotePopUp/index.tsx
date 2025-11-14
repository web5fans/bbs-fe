import S from './index.module.scss'
import { useEffect, useRef } from "react";
import QuoteIcon from '@/assets/posts/quote.svg'
import CopyIcon from '@/assets/copy.svg'
import { useToast } from "@/provider/toast";

type QuotePopupProps = {
  children: React.ReactNode
  quoteComment: (quote: string) => void
}

let timeout: NodeJS.Timeout

const QuotePopUp = (props: QuotePopupProps) => {
  const contentHtmlRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const selectionRange = useRef<Range[]>([])

  const selectionText = useRef('')

  const toast = useToast()

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

        popupRef.current.style.display = 'flex';
        popupRef.current.style.left = `${rect.left}px`

        if (action === 'mouse') {
          popupRef.current.style.top = `${rect.top + window.scrollY}px`
        } else {
          popupRef.current.style.transform = 'none';
          popupRef.current.style.top = `${rect.bottom + window.scrollY + 4}px`
        }


        saveSelection()
      } else {
        popupRef.current.style.display = 'none';
      }
    }
  }

  useEffect(() => {
    const f = () => {
      console.log('fff')
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

  return <>
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
      <div className={S.item} onClick={comment}>
        <QuoteIcon className={S.icon} />
        引用回复
      </div>
      <div className={S.item} onClick={copy}>
        <CopyIcon className={S.icon} />
        复制内容
      </div>
    </div>
  </>
}

export default QuotePopUp;