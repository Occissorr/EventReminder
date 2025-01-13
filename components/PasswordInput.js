import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const PasswordInput = ({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  containerStyle,
  inputStyle,
  iconColor,
  accaccessibility,
  accessibilityLabel,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.passwordContainer, containerStyle]}>
      <TextInput
        style={[styles.passwordInput, inputStyle]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        placeholderTextColor={placeholderTextColor}
        accessibilityLabel={accessibilityLabel}
        accessible={accaccessibility}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
        <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={24} color={iconColor || '#000'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  passwordInput: {
    flex: 1,
    padding: 0,
  },
  iconContainer: {
    padding: 5,
  },
});

export default PasswordInput;
