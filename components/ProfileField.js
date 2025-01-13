import React, { useContext } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import PasswordInput from './PasswordInput';

export const ProfileField = ({
  label,
  change,
  tempValue,
  text,
  placeholder,
  isEditing,
  keyboardType,
  isPassword
}) => {
  const { theme } = useContext(ThemeContext);
  const textColor = theme.colors.text;
  const displayText = isPassword ? `${text[0]}${'*'.repeat(text.length - 1)}` : text;

  return (
    <View style={[isEditing ? styles.inputContainer : styles.editContainer]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      {isEditing ? (
        isPassword ? (
          <PasswordInput
            value={tempValue}
            onChangeText={change}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.text}
            containerStyle={{ marginBottom: 20, backgroundColor: theme.colors.background }}
            inputStyle={{ color: theme.colors.text }}
            iconColor={theme.colors.overlay}
            accessible={true}
            accessibilityLabel={label}
          />
        ) : (
          <TextInput
            style={styles.input}
            value={tempValue}
            onChangeText={change}
            placeholder={placeholder}
            keyboardType={keyboardType}
          />
        )
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{displayText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
    padding: 3,
  },
  editContainer: {
    padding: 3,
    marginBottom: 15,
    borderBottomColor: '#555',
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  text: {
    fontSize: 16,
  },
});
