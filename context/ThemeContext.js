import React, { createContext, useState, useContext, useEffect } from 'react';
import { colors } from '../assets/styles';
import { AppContext } from './AppContext';

const lightTheme = {
  name: 'Light',
  colors: {
    background: colors.backgroundLight,
    text: colors.textPrimary,
    highlight: colors.primary,
    overlay: colors.overlayLit,
    error: colors.error1,
    inactive: colors.inactive,
    active: colors.active,
    inactiveThumb: colors.inactiveThumb,
    activeThumb: colors.activeThumb,
  },
};

const darkTheme = {
  name: 'Dark',
  colors: {
    background: colors.backgroundDark,
    text: colors.text3,
    highlight: colors.primary,
    overlay: colors.overlayDrk,
    error: colors.error1,
    inactive: colors.inactive,
    active: colors.active,
    inactiveThumb: colors.inactiveThumb,
    activeThumb: colors.activeThumb,
  },
};

const blueTheme = {
  name: 'Blue',
  colors: {
    background: colors.backgroundBlue,
    text: colors.textPrimary,
    highlight: colors.blueHighlight,
    overlay: colors.overlayBlue,
    error: colors.error1,
    inactive: colors.inactive,
    active: colors.active,
    inactiveThumb: colors.inactiveThumb,
    activeThumb: colors.activeThumb,
  },
};

const greenTheme = {
  name: 'Green',
  colors: {
    background: colors.backgroundGreen,
    text: colors.textPrimary,
    highlight: colors.greenHighlight,
    overlay: colors.overlayGreen,
    error: colors.error1,
    inactive: colors.inactive,
    active: colors.active,
    inactiveThumb: colors.inactiveThumb,
    activeThumb: colors.activeThumb,
  },
};

const themes = [lightTheme, darkTheme, blueTheme, greenTheme];

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { userData } = useContext(AppContext);
  const [theme, setTheme] = useState(lightTheme); // Default to Light Theme

  const setThemeByName = (themeName) => {
    const selectedTheme = themes.find((t) => t.name === themeName);
    if (selectedTheme) {
      setTheme(selectedTheme);
    }
  };

  useEffect(() => {
    if (userData) {
      setThemeByName(userData.theme);
    }
  }, [userData]);

  return (
    <ThemeContext.Provider value={{ theme, setThemeByName, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
