import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ThemeColors } from './colors';

type ThemeType = 'light' | 'dark';

interface ThemeContextData {
  theme: ThemeType;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({
  theme: 'light',
  isDark: false,
  colors: lightColors,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(systemColorScheme === 'dark' ? 'dark' : 'light');

  // If system theme changes, optionally auto-update (we'll only do it on first load for now, letting the toggle persist)
  
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
