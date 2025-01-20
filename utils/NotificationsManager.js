import * as Notifications from 'expo-notifications';
import { getEvents } from '../context/AppContext'; // Import getEvents from context

const scheduleNotifications = async (userData) => {
    const today = new Date().toISOString().split('T')[0];
    const { reminder } = userData.settings;
    const { frequency, range } = reminder;

    const rangeDays = {
        Weekly: 7,
        Monthly: 30,
        Yearly: 365,
    }[range] || 30; // Default to 30 days

    const dbEvents = await getEvents(userData); // Fetch events from context

    // Filter today's events
    const todaysEvents = dbEvents.filter((event) => event.date.startsWith(today));
    todaysEvents.forEach(scheduleTodayNotification);

    // Filter upcoming events based on rangeDays
    const upcomingEvents = dbEvents.filter((event) => {
        const eventDate = new Date(event.date);
        const diffDays = (eventDate - new Date()) / (1000 * 60 * 60 * 24);
        return diffDays <= rangeDays;
    });
    upcomingEvents.forEach(scheduleUpcomingNotification);
};

// Helper: Schedule today's event notification
const scheduleTodayNotification = async (event) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: `Today's Event: ${event.name}`,
            body: `Happening today. Don't miss it!`,
        },
        trigger: { seconds: 1 }, // Trigger immediately
    });
};

// Helper: Schedule upcoming event notification
const scheduleUpcomingNotification = async (event) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: `Upcoming Event: ${event.name}`,
            body: `Happening on ${event.date.split('T')[0]}.`,
        },
        trigger: { seconds: 5 }, // Trigger after 5 seconds (for testing)
    });
};
