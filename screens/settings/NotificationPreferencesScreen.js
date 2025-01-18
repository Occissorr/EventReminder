import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configure Notification Behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NotificationPreferencesScreen = () => {
  useEffect(() => {
    registerForPushNotificationsAsync();
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification Received:', notification);
    });

    return () => subscription.remove(); // Cleanup listener
  }, []);

  // Register for Push Notifications
  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If permission is not granted, ask for it
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // If permission is still not granted, show an alert
    if (finalStatus !== 'granted') {
      Alert.alert('Permission required', 'Please enable notifications in settings.');
      return;
    }

    // Get the token that identifies this device
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Notification Token:', token);
  };

  // Send Notification Immediately
  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Immediate Notification',
        body: 'This is sent immediately when you clicked the button!',
        data: { extraData: 'Button Clicked' },
      },
      trigger: null,
    });
  };

  // Schedule Notification after 20 seconds
  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Scheduled Notification',
        body: 'This notification was scheduled to appear after 20 seconds!',
        data: { extraData: 'Scheduled' },
        vibrate: [1000, 1000, 1000], // Vibrate for 1s, pause for 1s, vibrate for 1s
      },
      trigger: { seconds: 20 }, // Trigger after 20 seconds
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Push Notification Demo</Text>

      {/* Button to Send Immediate Notification */}
      <TouchableOpacity style={styles.button} onPress={sendNotification}>
        <Text style={styles.buttonText}>Send Notification Now</Text>
      </TouchableOpacity>

      {/* Button to Schedule Notification */}
      <TouchableOpacity style={styles.button} onPress={scheduleNotification}>
        <Text style={styles.buttonText}>Schedule Notification (20s)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationPreferencesScreen;
