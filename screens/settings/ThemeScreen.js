import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext.js';

const themes = [
  {
    name: 'Light',
    colors: {
      background: '#ffffff',
      text: '#000000',
    },
  },
  {
    name: 'Dark',
    colors: {
      background: '#1e1e1e',
      text: '#ffffff',
    },
  },
];

const ThemeScreen = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.text }]}>
        Choose Your Theme
      </Text>
      <View style={styles.tileContainer}>
        {themes.map((themeOption, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tile,
              { backgroundColor: themeOption.colors.background, borderColor: theme.colors.text },
            ]}
            onPress={() => setTheme(themeOption)}
          >
            <Text
              style={[styles.tileText, { color: themeOption.colors.text }]}
            >
              {themeOption.name}
            </Text>
            
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tileContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  tile: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
    borderWidth: 2,
  },
  tileText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ThemeScreen;
