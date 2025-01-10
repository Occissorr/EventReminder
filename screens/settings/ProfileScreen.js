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
import { ProfileField } from '../../components/ProfileField';

const ProfileScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const textColor = theme.colors.text;
  const bgColor = theme.colors.background;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [reminderFrequency, setReminderFrequency] = useState('Daily');
  const [reminderRange, setReminderRange] = useState('Month');

  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);
  const [tempFrequency, setTempFrequency] = useState(reminderFrequency);
  const [tempRange, setTempRange] = useState(reminderRange);

  const [modalVisible, setModalVisible] = useState(false);

  const handleEdit = () => {
    setTempName(name);
    setTempEmail(email);
    setTempPhone(phone);
    setTempFrequency(reminderFrequency);
    setTempRange(reminderRange);
    setIsEditing(true);
  };

  const handleSave = () => {
    setName(tempName);
    setEmail(tempEmail);
    setPhone(tempPhone);
    setReminderFrequency(tempFrequency);
    setReminderRange(tempRange);
    setIsEditing(false);
    Alert.alert('Profile Saved', 'Your changes have been successfully saved!');
  };

  const handleDiscardChanges = () => {
    setTempName(name);
    setTempEmail(email);
    setTempPhone(phone);
    setTempFrequency(reminderFrequency);
    setTempRange(reminderRange);
    setIsEditing(false);
    setModalVisible(false);
  };

  const fields = [
    { label: 'Name', value: name, setValue: setTempName, tempValue: tempName, placeholder: 'Enter your name' },
    { label: 'Email', value: email, setValue: setTempEmail, tempValue: tempEmail, placeholder: 'Enter your email', keyboardType: 'email-address' },
    { label: 'Phone', value: phone, setValue: setTempPhone, tempValue: tempPhone, placeholder: 'Enter your phone number', keyboardType: 'phone-pad' },
    { label: 'Reminder Frequency', value: reminderFrequency, setValue: setTempFrequency, tempValue: tempFrequency, placeholder: 'e.g., Daily, Weekly' },
    { label: 'Reminder Range', value: reminderRange, setValue: setTempRange, tempValue: tempRange, placeholder: 'e.g., Week, Month' }
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
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.header, { color: textColor }]}>Profile Settings</Text>

      {/* Edit Button */}
      {!isEditing && (
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Edit</Text>
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
        />
      ))}

      {/* Save Button */}
      {isEditing && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      )}

      {/* Modal for Unsaved Changes */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              You have unsaved changes. Do you want to save them?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonSave}
                onPress={() => {
                  handleSave();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonDiscard}
                onPress={handleDiscardChanges}
              >
                <Text style={styles.modalButtonText}>Discard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  editButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
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
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007BFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonSave: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
  },
  modalButtonDiscard: {
    backgroundColor: '#FF5A5F',
    padding: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
