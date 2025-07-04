
import { useCallback, useMemo, useRef } from 'react';

export const usePerformanceOptimization = () => {
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const throttleTimers = useRef<Map<string, number>>(new Map());

  const debounce = useCallback((key: string, callback: Function, delay: number) => {
    const existingTimer = debounceTimers.current.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      callback();
      debounceTimers.current.delete(key);
    }, delay);

    debounceTimers.current.set(key, timer);
  }, []);

  const throttle = useCallback((key: string, callback: Function, delay: number) => {
    const lastRun = throttleTimers.current.get(key) || 0;
    const now = Date.now();

    if (now - lastRun >= delay) {
      callback();
      throttleTimers.current.set(key, now);
    }
  }, []);

  const memoizedCallback = useCallback((callback: Function, deps: any[]) => {
    return useCallback(callback, deps);
  }, []);

  const memoizedValue = useCallback((factory: () => any, deps: any[]) => {
    return useMemo(factory, deps);
  }, []);

  return {
    debounce,
    throttle,
    memoizedCallback,
    memoizedValue,
  };
};
