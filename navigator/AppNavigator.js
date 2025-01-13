import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext'; // Import the ThemeContext

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
import PrivacyScreen from '../screens/settings/PrivacyScreen.js';
import PasswordResetScreen from '../screens/PasswordresetScreen.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for Home and Settings
const HomeTabs = () => {
  const { theme } = useContext(ThemeContext); // Access theme context


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Settings') {
            iconName = 'cogs';
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#88e051',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: theme.colors.background }, // Apply background color to tab bar
      })}
    >
      <Tab.Screen
        options={{
          headerStyle: { backgroundColor: theme.colors.background }, // Apply header background color
          headerTintColor: theme.colors.text, // Apply header text color
        }}
        name="Home" component={HomeScreen} />
      <Tab.Screen
        options={{
          headerStyle: { backgroundColor: theme.colors.background }, // Apply header background color
          headerTintColor: theme.colors.text, // Apply header text color
        }}
        name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const SettingsStack = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerStyle: { backgroundColor: theme.colors.background }, // Apply header background color
          headerTintColor: theme.colors.text, // Apply header text color
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
        }}
      />
      <Stack.Screen
        name="Theme"
        component={ThemeScreen}
        options={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
        }}
      />
      <Stack.Screen
        name="Reminder"
        component={ReminderScreen}
        options={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
        }}
      />
      <Stack.Screen
        name="Notification Preferences"
        component={NotificationPreferencesScreen}
        options={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
        }}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Addevent" component={AddEventScreen} />
        <Stack.Screen name="Main" component={HomeTabs} />
        <Stack.Screen name="Reset" component={PasswordResetScreen} />
        <Stack.Screen name="SettingsStack" component={SettingsStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
