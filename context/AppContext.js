import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [MainEventArr, setEvents] = useState([]);
    const [userData, setUserData] = useState(null);
    const API_BASE_URL = 'http://127.0.0.1:5000'; // Replace with your Flask API base URL

    // Load events from AsyncStorage
    const loadEvents = async () => {
        try {
            const localEvents = await AsyncStorage.getItem('events');
            if (localEvents) {
                setEvents(JSON.parse(localEvents));
            }
        } catch (e) {
            console.error('Error loading events:', e);
        }
    };

    // Store events in AsyncStorage
    const storeEvents = async (events) => {
        try {
            await AsyncStorage.setItem('events', JSON.stringify(events));
        } catch (e) {
            console.error('Error storing events:', e);
        }
    };

    // Add a new event
    const addEvent = async (newEvent) => {
        const updatedEvents = [...MainEventArr, newEvent];
        setEvents(updatedEvents);
        await storeEvents(updatedEvents);
    };

    // Delete an event
    const deleteEvent = async (id) => {
        const updatedEvents = MainEventArr.filter((event) => event.id !== id);
        setEvents(updatedEvents);
        await storeEvents(updatedEvents);
    };

    // Edit an event
    const editEvent = async (id, editedEvent) => {
        const updatedEvents = MainEventArr.map((event) =>
            event.id === id ? { ...event, ...editedEvent } : event
        );
        setEvents(updatedEvents);
        await storeEvents(updatedEvents);
    };

    // Load user data from AsyncStorage
    const loadUserData = async () => {
        console.log('Loading user data');
        try {
            const localUserData = await AsyncStorage.getItem('userData');
            if (localUserData) {
                console.log('User data loaded:', JSON.parse(localUserData));
                setUserData(JSON.parse(localUserData));
            }
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    };

    // Store user data in AsyncStorage
    const storeUserData = async (userData) => {
        try {
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
        } catch (error) {
            console.error('Failed to store user data:', error);
        }
    };

    // Remove user data from AsyncStorage
    const removeUserData = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            setUserData(null);
        } catch (error) {
            console.error('Failed to remove user data:', error);
        }
    };

    // API: User Signup
    const signupUser = async (name, email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/signup`, { name, email, password });
            if (response.status === 201) {
                return response.data.message;
            }
        } catch (error) {
            console.error('Signup failed:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Signup failed');
        }
    };

    // API: Resend OTP
    const resendOTP = async (email) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/resend-otp`, { email });
            if (response.status === 200) {
                return response.data.message;
            }
        } catch (error) {
            console.error('Resend OTP failed:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Resend OTP failed');
        }
    };

    // API: Sync Events with DB
    const syncEventsWithDB = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/events`, { headers: { email: userData?.email } });
            const dbEvents = response.data.events;
            setEvents(dbEvents);
            await storeEvents(dbEvents);
        } catch (error) {
            console.error('Error syncing events with DB:', error);
        }
    };

    // API: Push Events to DB
    const pushEventsToDB = async () => {
        try {
            if (userData?.email) {
                await axios.post(`${API_BASE_URL}/update-events`, { email: userData.email, events: MainEventArr });
            }
        } catch (error) {
            console.error('Error pushing events to DB:', error);
        }
    };

    useEffect(() => {
        loadUserData();
        loadEvents();
    }, []);

    useEffect(() => {
        if (userData) {
            syncEventsWithDB();
        }
    }, [userData]);

    return (
        <AppContext.Provider
            value={{
                MainEventArr,
                addEvent,
                deleteEvent,
                editEvent,
                userData,
                storeUserData,
                removeUserData,
                signupUser,
                resendOTP,
                syncEventsWithDB,
                pushEventsToDB,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
