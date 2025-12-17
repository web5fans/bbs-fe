import S from "./index.module.scss";
import TextHoverFocus from "@/components/TextHoverFocus";
import { DotLoading } from "@/components/Loading";
import DraftModal from "../DraftModal";
import { useBoolean } from "ahooks";
import { SetPostContentParamsType } from "../DraftSearchParamsWrap";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

const DraftInfo = ({ loading, setPostContent, updatedTime, curDraftUri }: {
  loading: boolean
  updatedTime?: string
  setPostContent: (obj: SetPostContentParamsType) => void
  curDraftUri?: string
}) => {
  const [draftModalVis, setDraftModalVis] = useBoolean(false)

  const renderInfo = useMemo(() => {
    if (loading) {
      return <div className={S.info}>
        <span>内容自动存草稿中</span>
        <DotLoading />
      </div>
    }
    if (updatedTime) {
      return <SaveTime updateTime={updatedTime} />
    }
  }, [loading, updatedTime])


  return <div className={S.wrap}>
    <TextHoverFocus text={'草稿箱'} classnames={{ inner: S.draft, wrap: '!text-right' }} onClick={setDraftModalVis.setTrue} />
    {renderInfo}

    <DraftModal
      visible={draftModalVis}
      onClose={setDraftModalVis.setFalse}
      continueEdit={setPostContent}
      disDeleteDraft={curDraftUri? [curDraftUri] : undefined}
    />
  </div>
}

export default DraftInfo;

function SaveTime({ updateTime }: {updateTime?: string}) {
  const [v, setV] = useState(0);
  const localTime = dayjs(updateTime).utc().local()

  useEffect(() => {
    const timer = setInterval(() => {
      setV(v => v + 1);
    }, 9 * 1000);

    return () => clearInterval(timer);
  }, []);

  const diffTime = dayjs().diff(localTime, 'second') || 1

  return <div className={S.info}>
    内容<span className={S.time}>{diffTime}s</span>前已自动储存草稿
  </div>
}