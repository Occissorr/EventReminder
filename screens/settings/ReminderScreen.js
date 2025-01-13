import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '../../context/ThemeContext';
import { AppContext } from '../../context/AppContext'; // Import AppContext
import { globalStyles } from '../../assets/styles';

const ReminderFrequency = {
    DAILY: 'Daily',
    WEEKLY: 'Weekly',
    MONTHLY: 'Monthly',
};

const ReminderRange = {
    WEEK: 'Week',
    MONTH: 'Month',
    YEAR: 'Year',
};

const ReminderScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const { userData, storeUserData } = useContext(AppContext); // Use context functions
    const [reminderFrequency, setReminderFrequency] = useState(userData?.reminderFrequency || ReminderFrequency.DAILY);
    const [reminderRange, setReminderRange] = useState(userData?.reminderRange || ReminderRange.MONTH);

    useEffect(() => {
        const updatedUserData = {
            ...userData,
            reminderFrequency,
            reminderRange,
        };
        storeUserData(updatedUserData);
    }, [reminderFrequency, reminderRange]);

    return (
        <View style={[globalStyles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[globalStyles.textHeader, styles.verticalMargin, { color: theme.colors.text }]}>
                Reminder Settings
            </Text>
            <Text style={[globalStyles.textPrimary, styles.verticalMargin,  { color: theme.colors.text }]}>Reminder Frequency</Text>
            <Picker
                selectedValue={reminderFrequency}
                onValueChange={(itemValue) => setReminderFrequency(itemValue)}
                style={[globalStyles.input, styles.verticalMargin,  { backgroundColor: theme.colors.background, borderColor: theme.colors.borderLight, color: theme.colors.text }]}
            >
                {Object.values(ReminderFrequency).map((frequency) => (
                    <Picker.Item key={frequency} label={frequency} value={frequency} />
                ))}
            </Picker>
            <Text style={[globalStyles.textPrimary, styles.verticalMargin,  { color: theme.colors.text }]}>Reminder Range</Text>
            <Picker
                selectedValue={reminderRange}
                onValueChange={(itemValue) => setReminderRange(itemValue)}
                style={[globalStyles.input, styles.verticalMargin,  { backgroundColor: theme.colors.background, borderColor: theme.colors.borderLight, color: theme.colors.text }]}
            >
                {Object.values(ReminderRange).map((range) => (
                    <Picker.Item key={range} label={range} value={range} />
                ))}
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    verticalMargin: {
        marginVertical: 20,
    }
});

export default ReminderScreen;
