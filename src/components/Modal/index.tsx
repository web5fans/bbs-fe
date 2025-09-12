'use client'

import React, { cloneElement, ReactElement, useState } from 'react';
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  autoUpdate,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal
} from '@floating-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import S from './index.module.scss'

type CenterModalProps = {
  children: React.ReactNode
  visible?: boolean
  onVisibleChange?: (isOpen: boolean) => void
  onClose?: () => void
  lockScroll?: boolean
}

export default function Modal(props: CenterModalProps) {
  const { lockScroll = true } = props;
  const [isOpen, setIsOpen] = useState(false);

  // Floating UI 配置
  const { refs, context } = useFloating({
    open: props.visible || isOpen,
    onOpenChange: (isOpen) => {
      if (props.onVisibleChange) {
        props.onVisibleChange(isOpen)
        return
      }
      setIsOpen(isOpen)
    },
    middleware: [], // 不需要定位中间件，默认居中
    whileElementsMounted: autoUpdate,
  });

  // 交互行为
  const click = useClick(context);
  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' });
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);
  // 动画配置
  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
  };

  const modalVis = props.visible || isOpen

  return (
    <>
      {/* 弹窗入口 */}
      <FloatingPortal>
        <AnimatePresence>
          {modalVis && (
            <FloatingOverlay
              lockScroll={lockScroll}
              className={S.overlay}
            >
              <motion.div
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <FloatingFocusManager context={context}>
                  <motion.div
                    ref={refs.setFloating}
                    {...getFloatingProps()}
                    variants={modalVariants}
                    className={S.modal}
                  >
                    <div className={S.inner}>
                      {props.children}
                    </div>
                  </motion.div>
                </FloatingFocusManager>
              </motion.div>
            </FloatingOverlay>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
}