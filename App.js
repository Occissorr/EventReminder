import React, { useContext } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './navigator/AppNavigator.js';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';

const App = () => {
  return (
      <AppProvider>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </AppProvider>
  );
};

const ThemedApp = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={theme.name === 'Dark' ? 'light-content' : 'dark-content'}
      />
      <AppNavigator />
    </>
  );
};

export default App;
