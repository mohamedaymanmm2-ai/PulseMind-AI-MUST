import { useState, useEffect } from 'react';

export function usePersistentState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return { ...defaultValue, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback to default on parse failure
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [key, state]);

  return [state, setState] as const;
}

export function usePersistentArray<T>(key: string, defaultValue: T[]) {
  const [state, setState] = useState<T[]>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback to default
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [key, state]);

  return [state, setState] as const;
}
