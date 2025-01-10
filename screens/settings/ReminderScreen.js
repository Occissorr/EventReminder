import React from 'react';
import { Button, Text, View } from 'react-native';

const ReminderScreen = ({ navigation }) => {
    return (
        <View>
            <Text>
                Reminder Settings
            </Text>
            <Button title="Back to Settings" onPress={() => navigation.goBack()} />
        </View>
    );
};

export default ReminderScreen;
