import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { globalStyles, colors, spacing, fontSizes } from '../assets/styles';
import { ThemeContext } from '../context/ThemeContext';
import { AppContext } from '../context/AppContext';
import PasswordInput from '../components/PasswordInput';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { theme } = useContext(ThemeContext);
  const { loginUser, storeUserData } = useContext(AppContext);

  // Handle user login
  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      const data = await response.json();
      if (response.ok) {
        const userData = {
          loggedIn: true,
          name: data.name,
          email: data.email,
          password: data.password,
          events: [],
          mobile: data.mobile || '',
          settings: {
            theme: theme.name,
            dataSharing: false,
            cloudStorage: false,
            notifications: true,
            reminder: {
              range: ReminderRange.MONTH,
              frequency: ReminderFrequency.MONTHLY,
            },
          },
          signupDate: new Date().toISOString(),
        };
        await storeUserData(userData);
        navigation.replace('Main');
      } else {
        setErrors({ login: data.message });
      }
    } catch (error) {
      setErrors({ login: error.message });
    }
  };

  // Navigate to Signup screen
  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  // Navigate to Reset Password screen
  const handleForgotPassword = () => {
    navigation.navigate('Reset');
  }

  // Handle back button press
  const backAction = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      { text: 'Cancel', onPress: () => null, style: 'cancel' },
      { text: 'Yes', onPress: () => BackHandler.exitApp() },
    ]);
    return true; // Prevent default back action
  };

  useFocusEffect(
    React.useCallback(() => {
      // Add the back handler
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove(); // Clean up on blur
    }, [])
  );

  return (
    <View style={[
      globalStyles.container,
      globalStyles.center,
      { backgroundColor: theme.colors.background }
    ]}>
      <Text style={[globalStyles.title, { color: theme.colors.text }]}>Login</Text>
      <TextInput
        style={[globalStyles.input, styles.width, styles.input, {
          color: theme.colors.text,
          backgroundColor: theme.colors.background
        }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={theme.colors.text}
      />
      <PasswordInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.text }]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={theme.colors.text}
        accessibilityLabel="Password"
        inputStyle={{ color: theme.colors.text }}
        accessible={true}
        containerStyle={[{ marginBottom: 20, backgroundColor: theme.colors.background }, styles.width, ]}
        iconColor={theme.colors.overlay}
      />
      {errors.login && <Text style={styles.errorText}>{errors.login}</Text>}
      <TouchableOpacity style={globalStyles.buttonPrimary} onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={globalStyles.anchor} onPress={handleForgotPassword}>Need Help Signing</Text>
      <Text style={globalStyles.anchor} onPress={handleSignUp}>Sign Up For New Account</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
  },
  width: {
    maxWidth: 300,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});

export default LoginScreen;
