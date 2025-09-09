'use client'

import S from './index.module.scss'
import { useEffect, useMemo, useRef } from "react";
import CircleInner from '@/assets/avatar/circle-inner.svg';
import CircleOuter from '@/assets/avatar/circle-outer.svg';

const colorsNum = 12

const Avatar = (props: {
  nickname: string,
  className?: string
}) => {
  const { nickname = '' } = props;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return
    const width = rootRef.current.clientWidth
    const outerWidth = `${Math.floor(width)}px`
    outerRef.current.style.width = outerWidth;
    outerRef.current.style.height = outerWidth;

    const innerWidth = `${Math.ceil(width * 0.92)}px`
    innerRef.current.style.width = innerWidth
    innerRef.current.style.height = innerWidth
  }, []);

  const hash = useMemo(() => {
    if (!nickname) return null;
    return Math.abs(toHashCode(nickname)) % colorsNum
  }, [nickname])

  if (!hash && hash !== 0) return null;

  return <div
    ref={rootRef}
    className={`${S.wrap} ${props.className} ${(hash || hash === 0) ? S[`color${hash + 1}`] : ''}`}
  >
    <CircleInner className={S.circleInner} ref={innerRef} />
    <CircleOuter ref={outerRef} className={S.circle} />
    <span className={S.nick}>{nickname[0]}</span>
  </div>
}

export default Avatar;

function toHashCode(value: string) {
  let hash = 0,
    i, chr, len;
  if (value.length == 0) return hash;
  for (i = 0, len = value.length; i < len; i++) {
    chr = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}