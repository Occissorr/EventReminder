import React, { useContext } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export const ProfileField = ({
  label,
  change,
  tempValue,
  text,
  placeholder,
  isEditing,
  keyboardType
}) => {

    const { theme } = useContext(ThemeContext);
    const textColor = theme.colors.text;
  return (
    <View style={[isEditing ? styles.inputContainer : styles.editContainer]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={tempValue}
          onChangeText={change}
          placeholder={placeholder}
        />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{text}</Text>
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
