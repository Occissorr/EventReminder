import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    FlatList,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [name, setName] = useState('');
    const [birthdays, setBirthdays] = useState([]);

    const handleDateSelect = (day) => {
        setSelectedDate(day.dateString);
    };

    const addBirthday = () => {
        if (!name || !selectedDate) {
            Alert.alert('Error', 'Please enter a name and select a date.');
            return;
        }

        setBirthdays([
            ...birthdays,
            { id: Date.now().toString(), name, date: selectedDate },
        ]);

        // Reset the form
        setName('');
        setSelectedDate('');
        Alert.alert('Success', 'Birthday added!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select a Date and Add a Birthday</Text>

            {/* Calendar Component */}
            <Calendar
                onDayPress={handleDateSelect}
                markedDates={{
                    [selectedDate]: {
                        selected: true,
                        selectedColor: '#007BFF',
                    },
                }}
                style={styles.calendar}
                theme={{
                    todayTextColor: '#FF6347',
                    arrowColor: '#007BFF',
                }}
            />

            {/* Input Form */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter name"
                    value={name}
                    onChangeText={setName}
                />
                <Text style={styles.selectedDate}>
                    Selected Date: {selectedDate || 'None'}
                </Text>

                <TouchableOpacity style={styles.addButton} onPress={addBirthday}>
                    <Text style={styles.addButtonText}>Add Birthday</Text>
                </TouchableOpacity>
            </View>

            {/* Birthday List */}
            <Text style={styles.birthdayListHeader}>Upcoming Birthdays</Text>
            <FlatList
                data={birthdays}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.birthdayItem}>
                        <Text style={styles.nameText}>{item.name}</Text>
                        <Text style={styles.dateText}>{item.date}</Text>
                    </View>
                )}
                contentContainerStyle={styles.birthdayList}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No birthdays added yet.</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    calendar: {
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    selectedDate: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555',
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    birthdayListHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    birthdayList: {
        paddingBottom: 20,
    },
    birthdayItem: {
        padding: 15,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 14,
        color: '#666',
    },
    emptyText: {
        textAlign: 'center',
        color: '#aaa',
        marginTop: 10,
    },
});

export default CalendarScreen;
