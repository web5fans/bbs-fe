import S from './index.module.scss'
import FlatBottomedCard from "@/components/FlatBottomedCard";
import LoadingRect from './images/loading-rect.svg'
import { useEffect, useState } from "react";
import sleep from "@/lib/sleep";

const ImportLoading = (props: {
  jumpToMain: () => void
}) => {
  const [complete, setComplete] = useState(false)

  const onComplete = async () => {
    setComplete(true)
    await sleep(1000)
    props.jumpToMain()
  }

  return <div className={S.wrap}>
    <p className={S.title}>导入你的Web5 DID信息</p>
    <FlatBottomedCard className={S.card}>
      <div className={S.inner}>
        <div className={'relative'}>
          <img
            src={'/assets/import-did/loading-wrap.png'}
            alt={''}
          />
          <div className={S.loadingPos}>
            <Loading onComplete={onComplete} />
          </div>
        </div>
        <p className={S.message}>
          {complete ? '信息数据导入BBS完成，跳转到主站中...' : '你的Web5 DID等信息数据正在导入BBS中...'}
        </p>
      </div>
    </FlatBottomedCard>
  </div>
}

export default ImportLoading;

function Loading(props: {
  onComplete: () => void
}) {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / 3000) * 100, 100);

      setPercent(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);

        setTimeout(props.onComplete, 200);
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return <div className={S.loadingWrap}>
    <div className={S.loading} style={{ width: `${percent}%` }} />
    <LoadingRect className={S.rect} style={{ left: `${percent}%` }} />
  </div>
}