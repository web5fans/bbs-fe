'use client'

import CopyIcon from '@/assets/copy.svg'
import { useToast } from "../../provider/toast";

const CopyText = (props: {
  text: string;
  className?: string;
}) => {
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

  return <CopyIcon className={props.className} style={{ cursor: 'pointer' }} onClick={copy} />
}

export default CopyText;