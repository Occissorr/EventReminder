import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    FlatList,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ThemeContext } from '../context/ThemeContext.js';
import { AppContext } from '../context/AppContext.js';
import { globalStyles, colors as color1 } from '../assets/styles.js';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { EventType } from '../assets/constants.js';

const AddEventScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const { addEvent, userData, storeUserData } = useContext(AppContext); // Use context functions
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [name, setName] = useState('');
    const [type, setType] = useState(EventType.BIRTHDAY);
    const [events, setEvents] = useState([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setSelectedDate(date);
        hideDatePicker();
    };

    const addBirthday = async () => {
        if (!name || !selectedDate) {
            Alert.alert('Error', 'Please enter a name and select a date.');
            return;
        }

        const newEvent = { id: `${Date.now()}-${Math.random()}`, name, date: selectedDate.toDateString(), type };
        setEvents([...events, newEvent]);

        // Add event to the main events array in AppContext
        await addEvent(newEvent);

        // Update user data with new event
        const updatedUserData = {
            ...userData,
            events: [...userData.events, newEvent],
        };
        await storeUserData(updatedUserData);

        resetFields();
        Alert.alert('Success', 'Event added!');
    };

    const handleCancel = () => {
        resetFields();
        setDatePickerVisibility(false);
        navigation.replace('Main');
    };

    const resetFields = () => {
        setName('');
        setSelectedDate(new Date());
        setType(EventType.BIRTHDAY);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <TouchableOpacity onPress={handleCancel} style={[styles.icon, styles.cancelButton, { backgroundColor: 'red' }]}>
                <MaterialIcons name="close" size={30} color={color1.text3} />
            </TouchableOpacity>
            <Text style={[styles.header, { color: theme.colors.text }]}>Add Events</Text>

            {/* Input Form */}
            <View style={[styles.inputContainer, { borderColor: theme.colors.text }]}>
                <View style={styles.fieldContainer}>
                    <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>Name:</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text, borderColor: theme.colors.text }]}
                        placeholder="Enter name"
                        placeholderTextColor={theme.colors.textPlaceholder}
                        value={name || ''}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>Date:</Text>
                    <TouchableOpacity onPress={showDatePicker} style={[styles.datePickerButton, { borderColor: theme.colors.text, backgroundColor: theme.colors.background }]}>
                        <Text style={[styles.datePickerText, { color: theme.colors.text }]}>
                            {selectedDate.toDateString()}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        maximumDate={new Date(2100, 11, 31)}
                        minimumDate={new Date(1900, 0, 1)}
                        textColor={theme.colors.text}
                        style={{ backgroundColor: theme.colors.background }}
                        color={theme.colors.highlight}
                        themeVariant={theme.name.toLowerCase()}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>Type:</Text>
                    <Picker
                        selectedValue={type}
                        style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text, }]}
                        itemStyle={{ color: theme.colors.text }}
                        onValueChange={(itemValue) => setType(itemValue)}
                    >
                        {Object.values(EventType).map((eventType) => (
                            <Picker.Item key={eventType} label={eventType.toUpperCase()} value={eventType} />
                        ))}
                    </Picker>
                </View>

                <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.highlight }]} onPress={addBirthday}>
                    <Text style={[globalStyles.buttonText, { color: color1.text3 }]}>Add Event</Text>
                </TouchableOpacity>
            </View>

            {/* Birthday List */}
            <Text style={[styles.birthdayListHeader, { color: theme.colors.text }]}>Upcoming Events</Text>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.birthdayItem, { backgroundColor: theme.colors.background, borderColor: theme.colors.borderLight }]}>
                        <Text style={[styles.nameText, { color: theme.colors.text }]}>{item.name}</Text>
                        <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>{item.date}</Text>
                        <Text style={[styles.typeText, { color: theme.colors.textSecondary }]}>{item.type.toUpperCase()}</Text>
                    </View>
                )}
                contentContainerStyle={styles.birthdayList}
                ListEmptyComponent={
                    <Text style={[styles.emptyText, { color: theme.colors.textPlaceholder }]}>No events added yet.</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 50,
        textAlign: 'center',
    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        width: '100%',
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    datePickerButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        width: '70%'
    },
    datePickerText: {
        fontSize: 16,
    },
    inputContainer: {
        marginBottom: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        width: '70%',
    },
    addButton: {
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    cancelButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    birthdayListHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
    },
    birthdayList: {
        paddingBottom: 20,
    },
    birthdayItem: {
        padding: 15,
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 5,
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 14,
    },
    typeText: {
        fontSize: 14,
        fontStyle: 'italic',
        textTransform: 'uppercase',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 10,
    },
    icon: {
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
});

export default AddEventScreen;
