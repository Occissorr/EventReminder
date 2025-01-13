import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext.js';
import { AppContext } from '../../context/AppContext'; // Import AppContext

const ThemeScreen = () => {
  const { theme, setThemeByName, themes } = useContext(ThemeContext);
  const { userData, storeUserData } = useContext(AppContext); // Use context functions

  const handleThemeChange = (themeName) => {
    setThemeByName(themeName);
    const updatedUserData = {
      ...userData,
      theme: themeName,
    };
    storeUserData(updatedUserData); // Store updated user data with new theme name
  };

  useEffect(() => {
    if (userData?.theme) {
      setThemeByName(userData.theme);
    }
  }, [userData]);

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
            onPress={() => handleThemeChange(themeOption.name)}
          >
            <View style={[styles.highlightSquare, { backgroundColor: themeOption.colors.highlight }]} />
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
  highlightSquare: {
    width: 30,
    height: 30,
    borderRadius: 5,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  tileText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ThemeScreen;
