'use client'

import Computer from "@/app/register-login/(components)/Computer";
import S from './index.module.scss'
import { useEffect, useRef } from "react";
import remResponsive from "@/lib/rem-responsive";

const SmileAnimate = () => {
  const ref = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return
    const clientWidth = divRef.current?.clientWidth || 0;
    const scale = (clientWidth / 92).toFixed(2);
    ref.current.style.transform = `scale(${scale})`;

  }, []);

  return <Computer>
    <div
      ref={divRef}
      style={{
        height: 0,
        width: `min(70px, ${remResponsive(47)})`
      }}
    />
    <div
      ref={ref}
      className={S.wrap}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="99"
        height="86"
        fill="none"
      >
        <rect
          width="6.99998"
          height="21"
          fill="#454545"
        />
        <rect
          x="18"
          y="71"
          width="6.99998"
          height="6.99998"
          fill="#454545"
        />
        <rect
          x="25"
          y="78"
          width="36.9999"
          height="7.39998"
          fill="#454545"
        />
        <rect
          x="62"
          y="71"
          width="6.99998"
          height="6.99998"
          fill="#454545"
        />
        <rect
          x="43"
          y="0.0571289"
          width="6.99998"
          height="41.9999"
          fill="#454545"
        />
        <rect
          x="85"
          y="0.0283203"
          width="6.99998"
          height="21"
          fill="#454545"
          className={S.eye}
        />
        <rect
          x="36"
          y="41.9995"
          width="14"
          height="6.99998"
          fill="#454545"
        />
      </svg>
    </div>
  </Computer>
}

export default SmileAnimate;