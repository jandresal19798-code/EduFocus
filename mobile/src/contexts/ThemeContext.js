import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const colors = {
  light: {
    primary: '#5C6BC0',
    primaryLight: '#8E99F3',
    secondary: '#7C4DFF',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    gray: '#9E9E9E',
    card: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  dark: {
    primary: '#7C4DFF',
    primaryLight: '#B388FF',
    secondary: '#651FFF',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    success: '#69F0AE',
    warning: '#FFB74D',
    error: '#FF5252',
    gray: '#757575',
    card: '#2D2D2D',
    shadow: 'rgba(0, 0, 0, 0.3)'
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === 'dark');
  const [userColorPreference, setUserColorPreference] = useState(null);

  useEffect(() => {
    if (userColorPreference === 'system') {
      setIsDark(Appearance.getColorScheme() === 'dark');
    }
  }, [userColorPreference]);

  const theme = {
    colors: userColorPreference 
      ? (userColorPreference === 'dark' ? colors.dark : colors.light)
      : (isDark ? colors.dark : colors.light),
    isDark,
    toggleTheme: () => setIsDark(!isDark),
    setColorPreference: setUserColorPreference
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const getThemeColors = (isDarkMode) => isDarkMode ? colors.dark : colors.light;
