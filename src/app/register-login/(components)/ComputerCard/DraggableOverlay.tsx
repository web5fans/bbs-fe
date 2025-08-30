'use client'

import React from 'react';
import {createPortal} from 'react-dom';
import {DragOverlay, useDndContext} from '@dnd-kit/core';
import type {DropAnimation} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

import ComputerCard from "@/app/register-login/(components)/ComputerCard";
import { useNickName } from "@/provider/RegisterNickNameProvider";

const dropAnimationConfig: DropAnimation = {
  keyframes({transform}) {
    return [
      {transform: CSS.Transform.toString(transform.initial)},
      {
        transform: CSS.Transform.toString({
          ...transform.final,
          scaleX: 0.94,
          scaleY: 0.94,
        }),
      },
    ];
  },
  sideEffects({active, dragOverlay}) {
    dragOverlay.node.style.opacity = '0';
    dragOverlay.node.style.zIndex = '0';

    return () => {
      dragOverlay.node.style.opacity = '';
      dragOverlay.node.style.zIndex = '-1';
    };
  },
};

interface Props {
  dropAnimation?: DropAnimation | null;
}

export function DraggableOverlay({
  dropAnimation = dropAnimationConfig,
}: Props) {
  const {active} = useDndContext();
  const { nickname } = useNickName()

  if (typeof window === 'object') {
    return createPortal(
      <DragOverlay dropAnimation={dropAnimation} style={{touchAction: 'none'}}>
        {active ? <ComputerCard dragging dragOverlay name={nickname} /> : null}
      </DragOverlay>,
      document?.body
    );
  }

  return null;
}
