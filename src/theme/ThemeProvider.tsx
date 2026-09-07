import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, type ColorToken } from './colors';

type ColorTokens = typeof lightColors;
type ColorScheme = 'light' | 'dark';

interface ThemeContextValue {
  scheme: ColorScheme;
  colors: ColorTokens;
}

const ThemeContext = createContext<ThemeContextValue>({
  scheme: 'light',
  colors: lightColors,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const value = useMemo<ThemeContextValue>(() => {
    const scheme: ColorScheme = colorScheme === 'dark' ? 'dark' : 'light';
    return {
      scheme,
      colors: scheme === 'dark' ? darkColors : lightColors,
    };
  }, [colorScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeScheme(): ColorScheme {
  return useContext(ThemeContext).scheme;
}

export function useColors(): ColorTokens {
  return useContext(ThemeContext).colors;
}

export function useColorToken(token: ColorToken): string {
  return useContext(ThemeContext).colors[token];
}
