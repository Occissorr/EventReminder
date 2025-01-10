import React from 'react';
import { Button, Text, View } from 'react-native';

const PrivacyScreen = ({ navigation }) => {
    return (
        <View>
            <Text>
                Privacy Settings
            </Text>
            <Button title="Back to Settings" onPress={() => navigation.goBack()} />
        </View>
    );
};

export default PrivacyScreen;
