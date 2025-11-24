import Icon from '@/assets/copy.svg'
import { useToast } from "../../provider/toast";
import S from './index.module.scss'

const Copy = (props: {
  className?: string
  text: string
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

  return <Icon className={`${S.icon} ${props.className}`} style={{ cursor: 'pointer' }} onClick={copy} />
}

export default Copy;