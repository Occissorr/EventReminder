import React from 'react';
import { Button, Text, View } from 'react-native';

const NotificationPreferencesScreen = ({ navigation }) => {
    return (
        <View>
            <Text>
                Notifications Settings
            </Text>
            <Button title="Back to Settings" onPress={() => navigation.goBack()} />
        </View>
    );
};

export default NotificationPreferencesScreen;
