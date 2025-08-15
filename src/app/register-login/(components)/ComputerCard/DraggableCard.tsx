'use client'

import ComputerCard, { ComputerCardProps } from "@/app/register-login/(components)/ComputerCard/index";
import { useDraggable } from "@dnd-kit/core";

const DraggableCard = (props: ComputerCardProps & { loading?: boolean }) => {
  const { isDragging, setNodeRef, listeners } = useDraggable({
    id: 'draggable-computer',
    disabled: props.disabled || props.loading
  });

  return  <ComputerCard
    {...props}
    ref={setNodeRef}
    listeners={listeners}
    dragging={isDragging}
  />
}

export default DraggableCard;