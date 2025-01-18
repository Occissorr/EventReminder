import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { AppContext } from '../context/AppContext';

// Screens
import LoginScreen from '../screens/LoginScreen.js';
import SignupScreen from '../screens/SignupScreen.js';
import HomeScreen from '../screens/HomeScreen.js';
import AddEventScreen from '../screens/AddEventScreen.js';
import SettingsScreen from '../screens/SettingsScreen.js';

// Settings Screens
import ThemeScreen from '../screens/settings/ThemeScreen.js';
import ProfileScreen from '../screens/settings/ProfileScreen.js';
import ReminderScreen from '../screens/settings/ReminderScreen.js';
import NotificationPreferencesScreen from '../screens/settings/NotificationPreferencesScreen.js';
import PasswordResetScreen from '../screens/PasswordresetScreen.js';
import Loader from '../components/Loader.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = { Home: 'home', Settings: 'cogs' };
          return <FontAwesome name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#88e051',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: theme.colors.background },
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { userData, loadUserData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      await loadUserData();
      setLoading(false);
    };
    initialize();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      {userData?.loggedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={HomeTabs} />
          <Stack.Screen name="Theme" component={ThemeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Reminder" component={ReminderScreen} />
          <Stack.Screen name="Addevent" component={AddEventScreen} />
          <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Reset" component={PasswordResetScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
