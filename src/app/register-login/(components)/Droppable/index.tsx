import React, { useEffect, useRef, useState } from 'react';
import {
  useDndMonitor,
  DragMoveEvent, DragEndEvent, UniqueIdentifier,
} from '@dnd-kit/core';
import ChainItem from "./ChainItem";

export default function Droppable(props: {
  hasErr?: boolean
}) {
  const { hasErr } = props;
  const [isOverHalf, setIsOverHalf] = useState(false)
  const [droppedId, setDroppedId] = useState<UniqueIdentifier | undefined>(undefined)
  const startPosRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (hasErr) setDroppedId(undefined)
  }, [hasErr]);

  useDndMonitor({
    onDragMove(event: DragMoveEvent) {
      if (!event.over) {
        if (isOverHalf) setIsOverHalf(false)
        return;
      }

      const dragWidth = event.activatorEvent.target.clientWidth
      const currentPosX = event.delta.x
      if (!startPosRef.current) {
        startPosRef.current = currentPosX
      }
      if (!startPosRef.current) return
      const moveHalf = (currentPosX - (startPosRef.current || 0)) > ( dragWidth / 2)

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
    <div className={'flex flex-col gap-[20px] items-center'}>
      {['A', 'B', 'C'].map((id, i) => <ChainItem
        id={id}
        key={id}
        isOverHalf={isOverHalf}
        droppedId={droppedId}
      />)}
    </div>
  );
}
