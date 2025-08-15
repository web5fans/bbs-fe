import localFont from "next/font/local";

const ArcadeInterlaced = localFont({
  src: [
    { path: './Arcade-Interlaced/ARCADE_I.ttf', weight: '400', style: 'normal' },
  ],
  variable: '--font-arcade'
})

const CLFN = localFont({
  src: [
    { path: './CLFN/c16xcnr.ttf', weight: '400', style: 'normal' },
    { path: './CLFN/c16xcnb.ttf', weight: '500', style: 'normal' },
  ],
  variable: '--font-CLFN'
})

const fontVariables = [
  ArcadeInterlaced.variable,
  CLFN.variable,
].join(' ')

export default fontVariables;
