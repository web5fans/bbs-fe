'use client'

import S from './index.module.scss'
import { useMemo } from "react";

const colorsNum = 12

const Avatar = (props: {
  nickname: string,
  className?: string
}) => {
  const { nickname = '' } = props;

  const hash = useMemo(() => {
    if (!nickname) return null;
    return Math.abs(toHashCode(nickname)) % colorsNum
  }, [nickname])

  if (!hash && hash !== 0) return null;

  return <div className={`${S.wrap} ${props.className} ${(hash || hash === 0) ? S[`color${hash + 1}`] : ''}`}>
    <CircleInner />
    <CircleOuter />
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

function CircleOuter(props: {className?: string}) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="168"
    height="168"
    viewBox="0 0 168 168"
    fill="none"
    className={S.circle}
  >
    <path
      d="M109.565 168H58.4346V160.695H109.565V168ZM58.4346 160.695H43.8262V153.392H58.4346V160.695ZM124.174 160.695H109.565V153.392H124.174V160.695ZM43.8262 153.392H29.2178V146.087H43.8262V153.392ZM138.782 153.392H124.174V146.087H138.782V153.392ZM29.2178 146.087H21.9131V138.782H29.2178V146.087ZM146.087 146.087H138.782V138.782H146.087V146.087ZM21.9131 138.782H14.6084V124.174H21.9131V138.782ZM153.392 138.782H146.087V124.174H153.392V138.782ZM14.6084 124.174H7.30469V109.565H14.6084V124.174ZM160.695 124.174H153.392V109.565H160.695V124.174ZM7.30469 109.565H0V58.4346H7.30469V109.565ZM168 109.565H160.695V58.4346H168V109.565ZM14.6084 58.4346H7.30469V43.8262H14.6084V58.4346ZM160.695 58.4346H153.392V43.8262H160.695V58.4346ZM21.9131 43.8262H14.6084V29.2178H21.9131V43.8262ZM153.392 43.8262H146.087V29.2178H153.392V43.8262ZM29.2178 29.2178H21.9131V21.9131H29.2178V29.2178ZM146.087 29.2178H138.782V21.9131H146.087V29.2178ZM43.8262 21.9131H29.2178V14.6084H43.8262V21.9131ZM138.782 21.9131H124.174V14.6084H138.782V21.9131ZM58.4346 14.6084H43.8262V7.30469H58.4346V14.6084ZM124.174 14.6084H109.565V7.30469H124.174V14.6084ZM109.565 7.30469H58.4346V0H109.565V7.30469Z"
      fill="currentColor"
    />
  </svg>
}

function CircleInner() {
  // return <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   width="92"
  //   height="92"
  //   viewBox="0 0 92 92"
  //   fill="none"
  //   className={S.circleInner}
  // >
  //   <g filter="url(#filter0_i_239_13022)">
  //     <path
  //       d="M61.2158 4.69629H69.9111V9.04492H78.6064V9.04199L78.6113 9.04492H78.6064V13.3926H82.9512L82.9541 13.3945V22.0879H87.3027V30.7832H91.6504V61.2188H91.6543V61.2207L91.6504 61.2275V61.2188H87.3027V69.9141H87.3037L87.3027 69.916V69.9141H82.9541V78.6064L82.9531 78.6094H78.6064V82.957H78.6113L78.6064 82.9609V82.957H69.9111V87.3057H69.9199L69.9111 87.3096V87.3057H61.2158V91.6533H61.2227L61.2158 91.6562V91.6533H30.7803V91.6582H30.7695L30.7598 91.6533H30.7803V87.3057H22.085V87.3105L22.0752 87.3057H22.085V82.957H13.3916L13.3896 82.9541V78.6094H9.04492L9.04199 78.6025V69.9141H4.69531L4.69336 69.9102V61.2188H0.349609L0.345703 46.0068V30.7832H0.34375L0.345703 30.7783V30.7832H4.69336V22.0879H4.69141L4.69336 22.083V22.0879H9.04199V13.4062L9.05566 13.3926H13.3896V9.04492H13.3232L13.3896 9.01172V9.04492H22.085V4.69629H22.0527L22.085 4.67969V4.69629H30.7803V0.351562H61.2158V4.69629Z"
  //       fill="none"
  //     />
  //   </g>
  //   <defs>
  //     <filter
  //       id="filter0_i_239_13022"
  //       x="0.34375"
  //       y="0.351562"
  //       width="91.3105"
  //       height="91.3047"
  //       filterUnits="userSpaceOnUse"
  //       color-interpolation-filters="sRGB"
  //     >
  //       <feFlood
  //         flood-opacity="0"
  //         result="BackgroundImageFix"
  //       />
  //       <feBlend
  //         mode="normal"
  //         in="SourceGraphic"
  //         in2="BackgroundImageFix"
  //         result="shape"
  //       />
  //       <feColorMatrix
  //         in="SourceAlpha"
  //         type="matrix"
  //         values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
  //         result="hardAlpha"
  //       />
  //       <feOffset />
  //       <feGaussianBlur stdDeviation="5" />
  //       <feComposite
  //         in2="hardAlpha"
  //         operator="arithmetic"
  //         k2="-1"
  //         k3="1"
  //       />
  //       <feColorMatrix
  //         type="matrix"
  //         values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
  //       />
  //       <feBlend
  //         mode="normal"
  //         in2="shape"
  //         result="effect1_innerShadow_239_13022"
  //       />
  //     </filter>
  //   </defs>
  // </svg>
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="154"
    height="154"
    viewBox="0 0 154 154"
    fill="none"
    className={S.circleInner}
  >
    <g filter="url(#filter0_i_330_43315)">
      <path
        d="M102.562 7.61164H117.17V14.9173H131.778V14.9124L131.786 14.9173H131.778V22.2214H139.077L139.082 22.2247V36.8295H146.388V51.4377H153.692V102.569H153.699V102.573L153.692 102.584V102.569H146.388V117.177H146.39L146.388 117.181V117.177H139.082V131.781L139.081 131.786H131.778V139.09H131.786L131.778 139.096V139.09H117.17V146.395H117.185L117.17 146.402V146.395H102.562V153.699H102.573L102.562 153.704V153.699H51.4302V153.708H51.4122L51.3958 153.699H51.4302V146.395H36.8221V146.404L36.8057 146.395H36.8221V139.09H22.2173L22.214 139.085V131.786H14.9148L14.9099 131.774V117.177H7.6075L7.60422 117.171V102.569H0.306719L0.300156 77.0134V51.4377H0.296875L0.300156 51.4295V51.4377H7.60422V36.8295H7.60094L7.60422 36.8213V36.8295H14.9099V22.2444L14.9329 22.2214H22.214V14.9173H22.1024L22.214 14.8616V14.9173H36.8221V7.61164H36.768L36.8221 7.58375V7.61164H51.4302V0.3125H102.562V7.61164Z"
        fill="none"
      />
    </g>
    <defs>
      <filter
        id="filter0_i_330_43315"
        x="0.296875"
        y="0.3125"
        width="153.402"
        height="153.398"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood
          flood-opacity="0"
          result="BackgroundImageFix"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="10" />
        <feComposite
          in2="hardAlpha"
          operator="arithmetic"
          k2="-1"
          k3="1"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_330_43315"
        />
      </filter>
    </defs>
  </svg>
}