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
  const { userData } = useContext(AppContext);

  const handleLogin = () => {
    if (userData) {
      if (email === userData.email && password === userData.password) {
        navigation.navigate('HomeScreen'); // Navigate to HomeScreen on successful login
      } else {
        setErrors({ login: 'Password or Email is incorrect!' });
      }
    } else {
      setErrors({ login: 'User does not exist, try Signing up!' });
    }
  };

  useEffect(() => {
    if (userData) {
      setEmail(userData.email);
      setPassword(userData.password);
    }
  }, [userData]);

  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    navigation.navigate('Reset');
  }

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
