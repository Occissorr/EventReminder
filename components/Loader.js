import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { globalStyles } from '../assets/styles';

const Loader = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[{flex: 1}, globalStyles.center, { backgroundColor: theme.colors.overlay }]}>
      <ActivityIndicator size="large" color={theme.colors.highlight} />
    </View>
  );
};

export default Loader;
