import { IntroLeft } from './left'
import { IntroRight } from './right'
import S from './index.module.scss'

export default function IntroStep(props: {
  goNext: () => void,
  showImport: (type: 'file' | 'scan') => void
}) {
  return <div className={S.wrap}>
    <IntroLeft goNext={props.goNext} showImport={props.showImport} />
    <IntroRight />
  </div>
}