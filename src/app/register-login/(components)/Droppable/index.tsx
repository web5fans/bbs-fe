import React, { useEffect, useRef, useState } from 'react';
import {
  useDndMonitor,
  DragMoveEvent, DragEndEvent, UniqueIdentifier,
} from '@dnd-kit/core';
import ChainItem from "./ChainItem";
import S from './index.module.scss'
import useMediaQuery from "@/hooks/useMediaQuery";

export default function Droppable(props: {
  hasErr?: boolean
}) {
  const { hasErr } = props;
  const [isOverHalf, setIsOverHalf] = useState(false)
  const [droppedId, setDroppedId] = useState<UniqueIdentifier | undefined>(undefined)
  const startPosRef = useRef<number | undefined>(undefined)

  const { isDesktop } = useMediaQuery()

  useEffect(() => {
    if (hasErr) setDroppedId(undefined)
  }, [hasErr]);

  useDndMonitor({
    onDragMove(event: DragMoveEvent) {
      if (!event.over) {
        if (isOverHalf) setIsOverHalf(false)
        return;
      }

      const target = event.activatorEvent.target;

      const dragWidth = isDesktop ? target?.clientWidth : target?.clientHeight;
      const currentPosDis = isDesktop ? event.delta.x : event.delta.y;
      if (!startPosRef.current) {
        startPosRef.current = currentPosDis
      }
      if (!startPosRef.current) return
      const moveHalf = (currentPosDis - (startPosRef.current || 0)) > ( dragWidth / 2)

      if (!isOverHalf && moveHalf ) {
        setIsOverHalf(true)
      }
      if (isOverHalf && !moveHalf) {
        setIsOverHalf(false)
      }
    },
    onDragEnd(event: DragEndEvent) {
      setDroppedId(event.over?.id)
      setIsOverHalf(false)
    }
  })

  return (
    <div className={S.chainWrap}>
      {['A', 'B', 'C'].map((id, i) => <ChainItem
        id={id}
        key={id}
        isOverHalf={isOverHalf}
        droppedId={droppedId}
      />)}
    </div>
  );
}
