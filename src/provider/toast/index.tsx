'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  useFloating,
  autoUpdate,
  FloatingPortal,
  useDismiss,
  useInteractions
} from '@floating-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import OKIcon from '@/assets/toast/ok.svg'
import ErrIcon from '@/assets/toast/err.svg'

import S from './index.module.scss'
import cx from "classnames";

type ToastOptions = {
  title: string
  message?: string;
  icon?: 'success' | 'error'
  duration?: number;
  id?: string
};

const iconsMap = {
  success: <OKIcon />,
  error: <ErrIcon />,
}

const NOTIFICATION_WIDTH = 386;
const NOTIFICATION_MARGIN = 32; // 消息间距16px

const ToastContext = createContext<(options: ToastOptions) => void>(() => {});

type ToastItemProps = ToastOptions & {
  topOffset?: number;
  onClose?: () => void;
}

// 单个通知组件
const ToastItem = ({
  title,
  message,
  icon,
  duration = 3000,
  onClose
}: ToastItemProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const { refs, context, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    placement: 'right',
  });

  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false)
      onClose?.()
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const slideIn = {
    hidden: {
      x: '100%', // 初始在右侧外
      opacity: 0
    },
    visible: {
      x: -10, // 滑动到屏幕右边缘
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      transition: {
        ease: 'easeIn'
      }
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={refs.setFloating}
          {...getFloatingProps()}
          style={{
            ...floatingStyles,
            position: 'fixed',
            left: 'initial',
            top: '1em',
            right: 0,
            zIndex: 9999,
            maxWidth: NOTIFICATION_WIDTH,
          }}
          variants={slideIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={S.toast}
        >
          <div className={S.inner}>
            {icon && iconsMap[icon]}
            <div className={S.info}>
              <p className={cx(S.title, icon === 'error' && '!text-[#CB2C3C]')}>{title}</p>
              {message && <p className={S.message}>{message}</p>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 通知容器组件
const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const showToast = (options: Omit<ToastOptions, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, {...options, id}]);
  };

  const getTopOffset = (index: number) => {
    return 20 + index * (56 + NOTIFICATION_MARGIN); // 56px是预估的通知高度
  };


  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <FloatingPortal>
        {toasts.map((item) => {
          return <ToastItem key={item.id} {...item}  />
        })}
      </FloatingPortal>
    </ToastContext.Provider>
  );
};

// 全局命令式调用方法
let toastRoot: ReturnType<typeof createRoot> | null = null;

const showGlobalToast = (options: ToastOptions) => {
  if (!toastRoot) {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    toastRoot = createRoot(container);
  }

  toastRoot.render(
    <FloatingPortal>
      <ToastItem {...options} />
    </FloatingPortal>
  );
};

// Hook方式调用
const useToast = () => useContext(ToastContext);

export { ToastProvider, useToast, showGlobalToast };