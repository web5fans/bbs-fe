import { useState, useEffect } from 'react';

// 定义断点类型
export type Breakpoint = 'desktop' | 'tablet' | 'mobile';

// 断点配置
export const breakpoints = {
  desktop: 1024, // > 1024px
  tablet: 769,   // 768px - 1023px
  mobile: 768    // <= 768px
} as const;

/**
 * 媒体查询 Hook
 * @returns 当前匹配的断点名称
 */
export default function useMediaQuery(): {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');
  const [innerWidth, setInnerWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      setInnerWidth(width)

      if (width > breakpoints.desktop) {
        setBreakpoint('desktop');
      } else if (width >= breakpoints.tablet) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('mobile');
      }
    };

    // 初始检查
    checkBreakpoint();

    // 添加监听
    window.addEventListener('resize', checkBreakpoint);

    // 清理函数
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return {
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
  };
};