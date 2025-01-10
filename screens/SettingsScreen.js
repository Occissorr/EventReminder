import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faUser,
  faPalette,
  faBell,
  faLock,
  faSignOutAlt,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

const SettingsScreen = ({ navigation }) => {
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
      id: '4',
      name: 'Notification Preferences',
      icon: faBell,
      function: () => {
        navigation.navigate('SettingsStack', { screen: 'Notification Preferences' });
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
      id: '6',
      name: 'Logout',
      icon: faSignOutAlt,
      function: () => {
        navigation.navigate('Login');
      },
      color: 'red'
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={settingsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={item.function}
            >
              <FontAwesomeIcon color={ item.color? item.color : ''} icon={item.icon} size={24} style={styles.icon} />
              <Text style={[
                styles.text,
                item.name === 'Logout' && styles.LogoutText
              ]}>{item.name}</Text>
            </Pressable>
        )}
      />
      {/* App Version shown at the bottom */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>App Version: 1.0.1</Text>
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
    color: 'inherit'
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  menuItemPressed: {
    backgroundColor: 'rgb(0, 123, 255)',
    color: 'white'
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
