import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Dummy login logic
    if (email && password) {
      navigation.navigate('Main');
    } else {
      alert('Please enter valid credentials!');
    }
  };

  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.anchor} onPress={handleSignUp}>Need Help Signing</Text>
      <Text style={styles.anchor} onPress={handleSignUp}>Sign Up For New Account</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center', // Center the content vertically
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    color: '#333',
    width: '100%', // Make inputs responsive
    maxWidth: 300, // Optional: Set a max-width for large screens
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%', // Make button responsive
    maxWidth: 300, // Optional: Set a max-width for large screens
    marginBottom: 15, // Add spacing below the button
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  anchor: {
    textDecorationStyle: 'solid',
    color: '#007BFF',
    textDecorationLine: 'underline',
    textDecorationColor: '#007BFF',
    marginTop: 10, // Add spacing between anchors
  },
});

export default LoginScreen;
