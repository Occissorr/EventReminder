import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  BackHandler,
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { AppContext } from '../../context/AppContext'; // Import AppContext
import { ProfileField } from '../../components/ProfileField';
import { globalStyles, colors } from '../../assets/styles';

const ProfileScreen = () => {
  const { theme } = useContext(ThemeContext);
  const { userData, storeUserData } = useContext(AppContext); // Use context functions
  const bgColor = theme.colors.background;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [password, setPassword] = useState(userData?.password || '');
  const [phone, setPhone] = useState(userData?.phone || '');

  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPassword, setTempPass] = useState(password);
  const [tempPhone, setTempPhone] = useState(phone);

  const [modalVisible, setModalVisible] = useState(false);

  const handleEdit = () => {
    setTempName(name);
    setTempEmail(email);
    setTempPass(password);
    setTempPhone(phone);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setName(tempName);
    setEmail(tempEmail);
    setPassword(tempPassword);
    setPhone(tempPhone);
    setIsEditing(false);
    Alert.alert('Profile Saved', 'Your changes have been successfully saved!');

    const updatedUserData = {
      ...userData,
      name: tempName,
      email: tempEmail,
      password: tempPassword,
      phone: tempPhone,
    };
    await storeUserData(updatedUserData); // Store updated user data
  };

  const handleDiscardChanges = () => {
    setTempName(name);
    setTempEmail(email);
    setTempPass(password);
    setTempPhone(phone);
    setIsEditing(false);
    setModalVisible(false);
  };

  const fields = [
    { label: 'Name', value: name, setValue: setTempName, tempValue: tempName, placeholder: 'Enter your name' },
    { label: 'Email', value: email, setValue: setTempEmail, tempValue: tempEmail, placeholder: 'Enter your email', keyboardType: 'email-address' },
    { label: 'Password', value: password, setValue: setTempPass, tempValue: tempPassword, placeholder: 'Enter new password', isPassword: true },
    { label: 'Phone', value: phone, setValue: setTempPhone, tempValue: tempPhone, placeholder: 'Enter your phone number', keyboardType: 'phone-pad' },
  ];

  const handleBackPress = () => {
    if (isEditing) {
      setModalVisible(true);
      return true;
    }
    return false;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );
    return () => backHandler.remove();
  }, [isEditing]);

  return (
    <View style={[globalStyles.container, { backgroundColor: bgColor }]}>
      {/* Edit Button */}
      {!isEditing && (
        <View style={styles.editButtonContainer}>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.colors.highlight }]}
            onPress={handleEdit}
          >
            <Text style={globalStyles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}

      {fields.map((field, index) => (
        <ProfileField
          key={index}
          label={field.label}
          tempValue={field.tempValue}
          change={field.setValue}
          keyboardType={field.keyboardType}
          text={field.value}
          isEditing={isEditing}
          isPassword={field.isPassword}
          placeholder={field.placeholder}
        />
      ))}

      {/* Save Button */}
      {isEditing && (
        <TouchableOpacity style={globalStyles.button} onPress={handleSave}>
          <Text style={globalStyles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      )}

      {/* Modal for Unsaved Changes */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={globalStyles.modalContainer}>
          <View style={[globalStyles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[globalStyles.modalText, { color: theme.colors.text }]}>
              You have unsaved changes. Do you want to save them?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButtonSave, { backgroundColor: theme.colors.highlight }]}
                onPress={() => {
                  handleSave();
                  setModalVisible(false);
                }}
              >
                <Text style={[styles.modalButtonText, {color: theme.colors.text}]}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButtonDiscard, { backgroundColor: 'red' }]}
                onPress={handleDiscardChanges}
              >
                <Text style={[styles.modalButtonText, {color: theme.colors.text}]}>Discard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButtonSave: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  modalButtonDiscard: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  editButton: {
    padding: 10,
    borderRadius: 8,
  },
});

export default ProfileScreen;
