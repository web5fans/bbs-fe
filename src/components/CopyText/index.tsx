'use client'

import CopyIcon from '@/assets/copy.svg'
import { useToast } from "../../provider/toast";
import S from './index.module.scss'
import ellipsis from "@/lib/ellipsis";
import { useMemo } from "react";

const CopyText = (props: {
  text: string;
  className?: {
    icon?: string
    wrap?: string
  };
  ellipsis?: { head?:number, tail?:number } | boolean
}) => {
  const { className, text } = props;
  const toast = useToast()

  const copy = async (event) => {
    event.stopPropagation();

    await navigator.clipboard.writeText(props.text);

    toast({
      title: '复制成功',
      message: props.text,
      icon: 'success'
    })
  }

  const showText = useMemo(() => {
    const ellis = props.ellipsis

    if (typeof ellis === 'object') {
      return ellipsis(text, ellis.head, ellis.tail)
    }

    if(typeof ellis === 'boolean' && ellis) {
      return ellipsis(text)
    }
    return text
  }, [text, props.ellipsis])

  return <div className={`${S.wrap} ${className?.wrap}`}>
    {showText}
    <CopyIcon className={`${S.icon} ${className?.icon}`} style={{ cursor: 'pointer' }} onClick={copy} />
  </div>
}

export default CopyText;