import { useCallback, useRef } from 'react';

export default function useDebounceWithCancel(callback, wait) {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const debounced = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, wait);
  }, [wait]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      // 注意：这里无法直接获取最后一次的参数
      timeoutRef.current = null;
    }
  }, []);

  return [debounced, cancel, flush];
}