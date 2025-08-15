import S from './index.module.scss'
import cx from "classnames";
import { type DraggableSyntheticListeners } from "@dnd-kit/core";
import { Ref } from "react";
import UserIcon from '@/assets/login/user.svg';

export type ComputerCardProps = {
  name?: string
  disabled?: boolean
}

type DragProps = ComputerCardProps & {
  dragOverlay?: boolean;
  dragging?: boolean;
  listeners?: DraggableSyntheticListeners;
  ref?: Ref<HTMLDivElement>;
  className?: string;
  style?: React.CSSProperties;
  size?: 'sm' | 'md'
}

const ComputerCard = (props: DragProps) => {
  const { size, dragOverlay, ref, name, disabled = false, listeners, dragging } = props

  return <div
    style={props.style}
    {...listeners}
    ref={ref}
    className={cx(S.card,
      disabled && S.disabled,
      dragging && S.dragging,
      dragOverlay && S.dragOverlay,
      size === 'sm' && S.cardS,
      props.className,
    )}
  >
    <UserIcon className={S.user} />
    <div className={S.name}>
      {name}
    </div>

    <span className={S.bottom} />
    <span className={S.right} />

    <img
      src={'/assets/login/move.svg'}
      alt="move"
      className={S.move}
    />
  </div>
}

export default ComputerCard;