'use client'

import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import S from './index.module.scss'
import cx from "classnames";


interface Props {
  id: UniqueIdentifier;
  isOverHalf?: boolean;
  droppedId?: UniqueIdentifier;
}

const ChainItem = ({ id, isOverHalf, droppedId }: Props) => {
  const {isOver, setNodeRef} = useDroppable({
    id,
  });

  const hover = isOver && isOverHalf

  return <div
    ref={setNodeRef}
    className={cx(S.wrap)}
  >
    <div className={cx(
      S.block,
      isOverHalf && S.half,
      (droppedId && droppedId !== id) && S.half,
      hover && S.twice,
      droppedId === id && S.twice,
    )}>
      <img src={'/assets/login/byte-static.png'} alt="" className={S.bgImage} />
      <img src={'/assets/login/byte-s.gif'} alt="" className={S.gif} />
    </div>
  </div>
}

export default ChainItem;