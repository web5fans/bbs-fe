import S from './index.module.scss'
import { useEffect, useRef } from "react";
import remResponsive from "@/lib/rem-responsive";
import Border from '@/assets/fund/type-border.svg'

const FlowTypeIcon = ({ text }: {
  text: string
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const span = document.createElement('span');
    span.style.width = remResponsive(9)
    document.body.appendChild(span);

    const width = getComputedStyle(span).width.replace('px', '')
    document.body.removeChild(span);
    const scale = (width / 18).toFixed(1);

    ref.current.style.transform = `scale(${scale})`
  }, []);

  return <div className={S.wrap} ref={ref}>
    <Border className={S.border} />
    {text}
  </div>
}

export default FlowTypeIcon;