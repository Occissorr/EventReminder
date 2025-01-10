import React, { useContext } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './navigator/AppNavigator.js';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
};


const ThemedApp = () => {
  const { theme } = useContext(ThemeContext);
  const hightlightColor = '#db7987';
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
