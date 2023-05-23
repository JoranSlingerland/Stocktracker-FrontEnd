import { useState, useEffect } from 'react';
import { theme as antdTheme } from 'antd';
const { darkAlgorithm, defaultAlgorithm } = antdTheme;

type ThemeType = 'light' | 'dark' | 'system';

const getTheme = (themeType: ThemeType) => {
  switch (themeType) {
    case 'light':
      return defaultAlgorithm;
    case 'dark':
      return darkAlgorithm;
    default:
      return defaultAlgorithm;
  }
};

const getClassName = (themeType: ThemeType) => {
  switch (themeType) {
    case 'light':
      return 'bg-white';
    case 'dark':
      return 'bg-neutral-900 dark';
    default:
      return 'bg-white';
  }
};

const useTheme = (userSettings: { dark_mode: ThemeType }) => {
  const [themeType, setThemeType] = useState<ThemeType>('system');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setThemeType(mediaQuery.matches ? 'dark' : 'light');
    const listener = (event: MediaQueryListEvent) => {
      setThemeType(event.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', listener);
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  const algorithmTheme =
    userSettings?.dark_mode === 'system'
      ? getTheme(themeType)
      : userSettings?.dark_mode === 'dark'
      ? darkAlgorithm
      : defaultAlgorithm;

  const className =
    userSettings?.dark_mode === 'system'
      ? getClassName(themeType)
      : userSettings?.dark_mode === 'dark'
      ? 'dark bg-neutral-900'
      : 'bg-white';

  return { algorithmTheme, className };
};

export default useTheme;
