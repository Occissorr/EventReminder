import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { globalStyles } from '../assets/styles';
import { ThemeContext } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';

const PasswordResetScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { resetPassword, resendOTP, loginUser, storeUserData, verifyOTP } = useContext(AppContext); // Use context functions

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpTimer, setOtpTimer] = useState(50);
  const [isOtpValid, setIsOtpValid] = useState(true);

  useEffect(() => {
    let timer;
    if (isOtpSent && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsOtpValid(false);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, otpTimer]);

  // Request OTP
  const handleRequestOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address.' });
      return;
    } else {
      setErrors({});
      try {
        await resendOTP(email);
        setIsOtpSent(true);
        setOtpTimer(50);
        setIsOtpValid(true);
        Alert.alert('Success', 'OTP has been sent to your email!');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleResendOtp = () => {
    if (otpTimer === 0) {
      handleRequestOtp();
    } else {
      Alert.alert('Error', `Please wait ${otpTimer} seconds before resending OTP.`);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!isOtpValid) {
      Alert.alert('Error', 'OTP has expired. Please request a new one.');
      return;
    }
    try {
      const response = await verifyOTP({ email, otp });
      if (response.status === 200) {
        Alert.alert('Success', 'OTP verified! You can now reset your password.');
      } else {
        Alert.alert('Error', 'Invalid OTP.');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP.');
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Reset Password
  const handleResetPassword = async () => {
    const validationErrors = {};

    if (!password) {
      validationErrors.password = 'Password is required.';
    } else if (password.length < 8 || !/\d/.test(password)) {
      validationErrors.password =
        'Password must be at least 8 characters long and contain at least one number.';
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await resetPassword(email, password);
        Alert.alert('Success', 'Password reset successful!');
        const loginResponse = await loginUser(email, password);
        const data = await loginResponse.data;
        if (loginResponse.status === 200) {
          await storeUserData(data.userData);
          navigation.replace('Main');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Password Reset</Text>

      {/* Email Input */}
      {!isOtpSent && (
        <>
          <TextInput
            style={[styles.input, { marginBottom: 20, color: theme.colors.text, backgroundColor: theme.colors.background }]}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={theme.colors.text}
          />
          {errors.email && <Text style={[globalStyles.errorText, { color: theme.colors.error }]}>{errors.email}</Text>}
          <TouchableOpacity style={[styles.button ]} onPress={handleRequestOtp}>
            <Text style={styles.buttonText}>Request OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {/* OTP Verification */}
      {isOtpSent && (
        <>
          <TextInput
            style={[styles.input, styles.margin, { marginBottom: 20, color: theme.colors.text, backgroundColor: theme.colors.background }]}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.text}
          />
          <TouchableOpacity style={[styles.button, styles.margin]} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.margin]} onPress={handleResendOtp}>
            <Text style={styles.buttonText}>Resend OTP</Text>
          </TouchableOpacity>
          <Text style={[styles.timerText, { color: theme.colors.text }]}>You can resend OTP in {otpTimer} seconds</Text>
        </>
      )}

      {/* Password Reset */}
      {isOtpSent && (
        <>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, color: theme.colors.text, backgroundColor: theme.colors.background }]}
              placeholder="New Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={theme.colors.text}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
              <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={24} color={theme.colors.overlay} />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={[globalStyles.errorText, { color: theme.colors.error }]}>{errors.password}</Text>}

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, color: theme.colors.text, backgroundColor: theme.colors.background }]}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor={theme.colors.text}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.iconContainer}>
              <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={24} color={theme.colors.overlay} />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={[globalStyles.errorText, { color: theme.colors.error }]}>{errors.confirmPassword}</Text>}

          <TouchableOpacity style={[styles.button, styles.margin]} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.anchor}>Back to Login</Text>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  iconContainer: {
    padding: 5,
  },
  timerText: {
    fontSize: 12,
    marginTop: 10,
  },
});

export default PasswordResetScreen;
