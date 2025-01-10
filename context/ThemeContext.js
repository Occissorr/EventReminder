import React, { createContext, useState } from 'react';

const lightTheme = {
  name: 'Light',
  colors: {
    background: 'rgba(0, 0, 0, 0)',
    text: '#000000',
  },
};

const darkTheme = {
  name: 'Dark',
  colors: {
    background: '#1e1e1e',
    text: '#ffffff',
  },
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme); // Default to Light Theme

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
