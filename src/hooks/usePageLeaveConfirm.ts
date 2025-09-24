import { useEffect, useRef } from "react";

export default function usePageLeaveConfirm() {
  const hasUnsavedChanges = useRef(true);
  const isFirstRender = useRef(true);

  useEffect(() => {

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      debugger
      if (hasUnsavedChanges.current) {
        event.preventDefault();
        event.returnValue = '';
        return '';
      }
    };

    const handlePopState = (event: PopStateEvent) => {
      if (hasUnsavedChanges.current) {
        // event.preventDefault();
        // 阻止浏览器后退
        // window.history.pushState(null, '', window.location.href);
        console.log('hrererer')

        // // 显示确认弹窗
        // setPendingNavigation(() => () => {
        //   // 实际执行导航
        //   window.history.back();
        // });
        // setShowDialog(true);
      }
    };

    // 监听浏览器刷新、关闭、导航
    window.addEventListener('beforeunload', () => {
      console.log('brfeore>>>>')});

    // 监听浏览器后退/前进按钮
    window.addEventListener('popstate', handlePopState);
    if (!isFirstRender.current) return;
    isFirstRender.current = false;
    // 添加一个历史记录条目，以便我们可以拦截后退操作
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);

  return {};
}