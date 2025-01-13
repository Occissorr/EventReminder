import React, { useState, useContext, useEffect } from 'react';
import { Button, Text, View, Switch, StyleSheet } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { AppContext } from '../../context/AppContext';

const PrivacyScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const { userData, storeUserData } = useContext(AppContext); // Use context functions

    const [dataSharing, setDataSharing] = useState(userData?.dataSharing || false);
    const [notifications, setNotifications] = useState(userData?.notifications || true);
    const [cloudStorage, setCloudStorage] = useState(userData?.cloudStorage || false);

    useEffect(() => {
        const updatedUserData = {
            ...userData,
            dataSharing,
            notifications,
            cloudStorage,
        };
        storeUserData(updatedUserData);
    }, [dataSharing, notifications, cloudStorage]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.header, { color: theme.colors.text }]}>Privacy Settings</Text>
            
            <View style={styles.setting}>
                <Text style={{ color: theme.colors.text }}>Data Sharing</Text>
                <Switch
                    value={dataSharing}
                    trackColor={{ false: theme.colors.inactive, true: theme.colors.active }}
                    thumbColor={dataSharing ? theme.colors.activeThumb : theme.colors.inactiveThumb}
                    onValueChange={setDataSharing}
                />
            </View>
            <Text style={[styles.description, { color: theme.colors.text }]}>
                Allow the app to share your data with third parties for analytics and advertising purposes.
            </Text>
            
            <View style={styles.setting}>
                <Text style={{ color: theme.colors.text }}>Notifications</Text>
                <Switch
                    value={notifications}
                    trackColor={{ false: theme.colors.inactive, true: theme.colors.active }}
                    thumbColor={notifications ? theme.colors.activeThumb : theme.colors.inactiveThumb}
                    onValueChange={setNotifications}
                />
            </View>

            <View style={styles.setting}>
                <Text style={{ color: theme.colors.text }}>Cloud Storage</Text>
                <Switch
                    value={cloudStorage}
                    trackColor={{ false: theme.colors.inactive, true: theme.colors.active }}
                    thumbColor={cloudStorage ? theme.colors.activeThumb : theme.colors.inactiveThumb}
                    onValueChange={setCloudStorage}
                />
            </View>
            
            <Text style={[styles.description, { color: theme.colors.text }]}>
                Enables cloud storage. This will store your data on the cloud for easy access across devices.
            </Text>
            
            <Button title="Back to Settings" onPress={() => navigation.goBack()} color={theme.colors.highlight} />
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
        marginBottom: 20,
    },
    setting: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    description: {
        fontSize: 14,
        marginBottom: 20,
    },
});

export default PrivacyScreen;
