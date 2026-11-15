import { useEffect, useState } from 'react';
import { ThemeMode } from '../types';

export function useThemeSync(themeMode: ThemeMode) {
  const [resolvedDark, setResolvedDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (themeMode === 'dark') return true;
    if (themeMode === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const shouldBeDark =
        themeMode === 'dark' || (themeMode === 'system' && media.matches);
      setResolvedDark(shouldBeDark);
      const root = document.documentElement;
      if (shouldBeDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    const handleChange = () => {
      if (themeMode === 'system') applyTheme();
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [themeMode]);

  return resolvedDark;
}
