import React, { useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '../../context/ThemeContext';
import { AppContext } from '../../context/AppContext'; // Import AppContext
import { globalStyles } from '../../assets/styles';
import { ReminderFrequency, ReminderRange } from '../../assets/constants';


const ReminderScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const { userData, storeUserData } = useContext(AppContext); // Use context functions
    const [reminderFrequency, setReminderFrequency] = useState(userData?.reminder.frequency || ReminderFrequency.DAILY);
    const [reminderRange, setReminderRange] = useState(userData?.reminder.range || ReminderRange.MONTH);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                const updatedUserData = {
                    ...userData,
                    reminder: {
                        range: reminderRange,
                        frequency: reminderFrequency
                    }
                };
                storeUserData(updatedUserData);
            };
        }, [reminderFrequency, reminderRange])
    );

    return (
        <View style={[globalStyles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[globalStyles.textHeader, styles.verticalMargin, { color: theme.colors.text }]}>
                Reminder Settings
            </Text>
            <Text style={[globalStyles.textPrimary, styles.verticalMargin, styles.height, { color: theme.colors.text }]}>Reminder Frequency</Text>
            <View style={[
                styles.pickerContainer,
                { borderColor: theme.colors.borderLight },
            ]}>
                <Picker
                    selectedValue={reminderFrequency}
                    onValueChange={(itemValue) => setReminderFrequency(itemValue)}
                    style={[
                        globalStyles.input,
                        styles.verticalMargin,
                        styles.picker,
                        { backgroundColor: theme.colors.background, color: theme.colors.text }
                    ]}
                >
                    {Object.values(ReminderFrequency).map((frequency) => (
                        <Picker.Item key={frequency} label={frequency} value={frequency} />
                    ))}
                </Picker>
            </View>
            <Text style={[globalStyles.textPrimary, styles.verticalMargin, styles.height, { color: theme.colors.text }]}>Reminder Range</Text>
            <View style={[
                styles.pickerContainer,
                { borderColor: theme.colors.borderLight },
            ]}>
                <Picker
                    selectedValue={reminderRange}
                    onValueChange={(itemValue) => setReminderRange(itemValue)}
                    style={[
                        globalStyles.input,
                        styles.verticalMargin,
                        styles.picker,
                        { backgroundColor: theme.colors.background, borderColor: theme.colors.borderLight, color: theme.colors.text }
                    ]}
                >
                    {Object.values(ReminderRange).map((range) => (
                        <Picker.Item key={range} label={range} value={range} />
                    ))}
                </Picker>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    verticalMargin: {
        marginVertical: 1,
    },
    height: {
        height: 30,
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10
    },
    picker: {
        height: 50,
        borderRadius: 10,
        margin: 5
    },
});

export default ReminderScreen;
