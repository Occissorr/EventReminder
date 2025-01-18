import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faUser,
  faPalette,
  faLock,
  faSignOutAlt,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../context/ThemeContext';
import { AppContext } from '../context/AppContext';

const SettingsScreen = ({ navigation, userData }) => {
  const { storeUserData } = useContext(AppContext);

  const settingsList = [
    {
      id: '1',
      name: 'Profile Settings',
      icon: faUser,
      function: () => {
        navigation.navigate('SettingsStack', { screen: 'Profile' });
      },
    },
    {
      id: '2',
      name: 'Theme Settings',
      icon: faPalette,
      function: () => {
        navigation.navigate('SettingsStack', { screen: 'Theme' });
      },
    },
    {
      id: '3',
      name: 'Reminder Settings',
      icon: faClock,
      function: () => {
        navigation.navigate('SettingsStack', { screen: 'Reminder' });
      },
    },
    {
      id: '5',
      name: 'Privacy Settings',
      icon: faLock,
      function: () => {
        navigation.navigate('SettingsStack', { screen: 'Privacy' });
      },
    },
    {
      id: '7',
      name: 'Notification Preferences',
      icon: faLock,
      function: () => {
        navigation.navigate('SettingsStack', { screen: 'Notification Preferences' });
      },
    },
    {
      id: '6',
      name: 'Logout',
      icon: faSignOutAlt,
      function: () => {
        navigation.replace('Login');
        storeUserData({...userData, loggedIn: false});
      },
      color: 'red'
    },
  ];
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background}]}>
      <FlatList
        data={settingsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.menuItem, 
                pressed && { backgroundColor: theme.colors.highlight },
              ]}
              onPress={item.function}
            >
              <FontAwesomeIcon color={ item.color? item.color : theme.colors.text} icon={item.icon} size={24} style={styles.icon} />
              <Text style={[
                styles.text, { color: theme.colors.text},
                item.name === 'Logout' && styles.LogoutText
              ]}>{item.name}</Text>
            </Pressable>
        )}
      />
      {/* App Version shown at the bottom */}
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: theme.colors.text }]}>App Version: 1.0.1</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  versionText: {
    fontSize: 14,
    color: '#666',
  },
  LogoutText: {
    color: 'red'
  },
  icon: {
    marginRight: 10,
    color: '#666',
  },
});

export default SettingsScreen;
