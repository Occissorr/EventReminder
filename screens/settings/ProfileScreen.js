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
        <TouchableOpacity style={[style.editButton, { backgroundColor: theme.colors.highlight}]} onPress={handleEdit}>
          <Text style={globalStyles.buttonText}>Edit</Text>
        </TouchableOpacity>
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
          <View style={globalStyles.modalContent}>
            <Text style={globalStyles.modalText}>
              You have unsaved changes. Do you want to save them?
            </Text>
            <View style={globalStyles.modalButtons}>
              <TouchableOpacity
                style={globalStyles.modalButtonSave}
                onPress={() => {
                  handleSave();
                  setModalVisible(false);
                }}
              >
                <Text style={style.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={globalStyles.modalButtonDiscard}
                onPress={handleDiscardChanges}
              >
                <Text style={style.modalButtonText}>Discard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const style = StyleSheet.create({
  editButton: {
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 8,
  }, 
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordContainer: {
    marginVertical: 10,
  },
})
export default ProfileScreen;
