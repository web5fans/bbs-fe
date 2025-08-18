import S from './index.module.scss'

const colorsNum = 12

const Avatar = (props: {
  nickname: string,
  className?: string
  did: string
}) => {
  const { nickname = '', did = '' } = props;

  const hash = Math.abs(toHashCode(nickname)) % colorsNum

  const firstLetter = did?.replace('did:web5:', '').match(/[a-zA-Z]/)

  return <div className={`${S.wrap} ${props.className} ${S[`color${hash + 1}`]}`}>
    <CircleInner />
    <CircleOuter className={S.circle} />
    <span className={S.nick}>{firstLetter?.[0]}</span>
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
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    className={S.circle}
  >
    <path
      d="M65.2178 100H34.7822V95.6523H65.2178V100ZM34.7822 95.6523H26.0869V91.3047H34.7822V95.6523ZM73.9131 95.6523H65.2178V91.3047H73.9131V95.6523ZM26.0869 91.3047H17.3916V86.9561H26.0869V91.3047ZM82.6084 91.3047H73.9131V86.9561H82.6084V91.3047ZM17.3916 86.9561H13.0439V82.6084H17.3916V86.9561ZM86.9561 86.9561H82.6084V82.6084H86.9561V86.9561ZM13.0439 82.6084H8.69531V73.9131H13.0439V82.6084ZM91.3047 82.6084H86.9561V73.9131H91.3047V82.6084ZM8.69531 73.9131H4.34766V65.2178H8.69531V73.9131ZM95.6523 73.9131H91.3047V65.2178H95.6523V73.9131ZM4.34766 65.2178H0V34.7822H4.34766V65.2178ZM100 65.2178H95.6523V34.7822H100V65.2178ZM8.69531 34.7822H4.34766V26.0869H8.69531V34.7822ZM95.6523 34.7822H91.3047V26.0869H95.6523V34.7822ZM13.0439 26.0869H8.69531V17.3916H13.0439V26.0869ZM91.3047 26.0869H86.9561V17.3916H91.3047V26.0869ZM17.3916 17.3916H13.0439V13.0439H17.3916V17.3916ZM86.9561 17.3916H82.6084V13.0439H86.9561V17.3916ZM26.0869 13.0439H17.3916V8.69531H26.0869V13.0439ZM82.6084 13.0439H73.9131V8.69531H82.6084V13.0439ZM34.7822 8.69531H26.0869V4.34766H34.7822V8.69531ZM73.9131 8.69531H65.2178V4.34766H73.9131V8.69531ZM65.2178 4.34766H34.7822V0H65.2178V4.34766Z"
      fill="currentColor"
    />
  </svg>
}

function CircleInner() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="92"
    height="92"
    viewBox="0 0 92 92"
    fill="none"
    className={S.circleInner}
  >
    <g filter="url(#filter0_i_239_13022)">
      <path
        d="M61.2158 4.69629H69.9111V9.04492H78.6064V9.04199L78.6113 9.04492H78.6064V13.3926H82.9512L82.9541 13.3945V22.0879H87.3027V30.7832H91.6504V61.2188H91.6543V61.2207L91.6504 61.2275V61.2188H87.3027V69.9141H87.3037L87.3027 69.916V69.9141H82.9541V78.6064L82.9531 78.6094H78.6064V82.957H78.6113L78.6064 82.9609V82.957H69.9111V87.3057H69.9199L69.9111 87.3096V87.3057H61.2158V91.6533H61.2227L61.2158 91.6562V91.6533H30.7803V91.6582H30.7695L30.7598 91.6533H30.7803V87.3057H22.085V87.3105L22.0752 87.3057H22.085V82.957H13.3916L13.3896 82.9541V78.6094H9.04492L9.04199 78.6025V69.9141H4.69531L4.69336 69.9102V61.2188H0.349609L0.345703 46.0068V30.7832H0.34375L0.345703 30.7783V30.7832H4.69336V22.0879H4.69141L4.69336 22.083V22.0879H9.04199V13.4062L9.05566 13.3926H13.3896V9.04492H13.3232L13.3896 9.01172V9.04492H22.085V4.69629H22.0527L22.085 4.67969V4.69629H30.7803V0.351562H61.2158V4.69629Z"
        fill="none"
      />
    </g>
    <defs>
      <filter
        id="filter0_i_239_13022"
        x="0.34375"
        y="0.351562"
        width="91.3105"
        height="91.3047"
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
        <feGaussianBlur stdDeviation="5" />
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
          result="effect1_innerShadow_239_13022"
        />
      </filter>
    </defs>
  </svg>
}