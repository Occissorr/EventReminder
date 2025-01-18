import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { globalStyles } from '../assets/styles';
import { ThemeContext } from '../context/ThemeContext';
import axios from 'axios';
import PasswordInput from '../components/PasswordInput'; // Import the new component
import { API_BASE_URL, ReminderFrequency, ReminderRange } from '../assets/constants.js'; // Import API base URL
import { AppContext } from '../context/AppContext'; // Import AppContext

const SignupScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext) || { colors: { background: '#fff', text: '#000', overlay: '#000' } };
  const { signupUser, resendOTP, storeUserData, removeUserData } = useContext(AppContext); // Use context functions

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(50);
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (isOtpSent && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, resendTimer]);

  useEffect(() => {
    if (isOtpSent) {
      const expiryTime = new Date().getTime() + 5 * 60 * 1000; // OTP valid for 5 minutes
      setOtpExpiry(expiryTime);
    }
  }, [isOtpSent]);

  // Form Validation
  const validateForm = () => {
    const validationErrors = {};

    // Name Validation
    if (!name) {
      validationErrors.name = 'Name is required.';
    } else if (name.length < 3) {
      validationErrors.name = 'Name must be at least 3 characters.';
    }

    // Email Validation
    if (!email) {
      validationErrors.email = 'Email is required.';
    } else if (!validateEmail(email)) {
      validationErrors.email = 'Please enter a valid email address.';
    }

    // Password Validation
    if (!password) {
      validationErrors.password = 'Password is required.';
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      validationErrors.password =
        'Password must be at least 8 characters long, include a number, an uppercase letter, and a special character.';
    }
    

    // Confirm Password Validation
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Email Format Validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle Signup
  const handleSignup = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
        // Store user data in local storage
        const userData = {
          loggedIn:true,
            name,
            email,
            password,
            events: [],
            mobile: '',
            loggedIn: true,
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
        const message = await signupUser(userData);
        Alert.alert('Success', message);
        setIsOtpSent(true); // Set OTP sent state to true
        setResendTimer(50); // Reset resend timer
        await removeUserData(); // Remove previous user data if exists
        await storeUserData(userData); // Store new user data
        console.log('User data stored:', userData);
    } catch (error) {
        Alert.alert('Error', error.message);
    } finally {
        setIsLoading(false);
    }
};

  // Handle OTP Resend
  const handleResendOtp = async () => {
    try {
      const message = await resendOTP(email);
      Alert.alert('Success', message);
      setResendTimer(50);
      setOtpExpiry(new Date().getTime() + 5 * 60 * 1000); // Reset OTP expiry
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };  

  // Handle OTP Verification
  const handleOtpVerification = async () => {
    const currentTime = new Date().getTime();
    if (currentTime > otpExpiry) {
      Alert.alert('Error', 'OTP has expired. Please request a new one.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        email,
        otp,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Account verified successfully!');
        navigation.replace('Main');
      } else {
        Alert.alert('Error', 'Invalid OTP.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to verify OTP.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Sign Up</Text>

      {/* Name Input */}
      <TextInput
        style={[styles.input, { marginBottom: 20, color: theme.colors.text, backgroundColor: theme.colors.background }]}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor={theme.colors.text}
        accessible={true}
        accessibilityLabel="Name"
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      {/* Email Input */}
      <TextInput
        style={[styles.input, { marginBottom: 20, color: theme.colors.text, backgroundColor: theme.colors.background }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={theme.colors.text}
        accessible={true}
        accessibilityLabel="Email"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      {/* Password Input */}
      <PasswordInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={theme.colors.text}
        containerStyle={{ marginBottom: 20, backgroundColor: theme.colors.background }}
        inputStyle={{ color: theme.colors.text }}
        iconColor={theme.colors.overlay}
        accessible={true}
        accessibilityLabel="Password"
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      {/* Confirm Password Input */}
      <PasswordInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        placeholderTextColor={theme.colors.text}
        containerStyle={{ marginBottom: 20, backgroundColor: theme.colors.background }}
        inputStyle={{ color: theme.colors.text }}
        iconColor={theme.colors.overlay}
        accessible={true}
        accessibilityLabel="Confirm Password"
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      {/* Signup Button */}
      {!isOtpSent ? (
        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={isLoading} accessible={true} accessibilityLabel="Send OTP">
          <Text style={styles.buttonText}>{isLoading ? 'Sending...' : 'Send OTP'}</Text>
        </TouchableOpacity>
      ) : (
        <>
          {/* OTP Input */}
          <TextInput
            style={[styles.input, { marginBottom: 20, color: theme.colors.text, backgroundColor: theme.colors.background }]}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            placeholderTextColor={theme.colors.text}
            accessible={true}
            accessibilityLabel="Enter OTP"
          />
          <TouchableOpacity style={[styles.button, styles.margin]} onPress={handleOtpVerification} accessible={true} accessibilityLabel="Verify OTP">
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
          {resendTimer > 0 ? (
            <Text style={styles.resendText}>Resend OTP in {resendTimer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResendOtp} accessible={true} accessibilityLabel="Resend OTP">
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <TouchableOpacity onPress={() => navigation.replace('Login')} accessible={true} accessibilityLabel="Already have an account? Login">
        <Text style={styles.anchor}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: globalStyles.container,
  title: globalStyles.title,
  input: globalStyles.input,
  button: globalStyles.button,
  buttonText: globalStyles.buttonText,
  anchor: globalStyles.anchor,
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  resendText: {
    color: 'gray',
    fontSize: 12,
    marginTop: 10,
  },
  resendLink: {
    color: 'blue',
    fontSize: 12,
    marginTop: 10,
  },
});

export default SignupScreen;
