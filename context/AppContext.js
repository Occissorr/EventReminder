import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../assets/constants';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [MainEventArr, setEvents] = useState([]);
    const [userData, setUserData] = useState(null);
    const [usersArr, setUsersArr] = useState([]);

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
        try {
            const localUserData = await AsyncStorage.getItem('userData');
            const response = await axios.get(`${API_BASE_URL}/get-users`);
            if (response.status === 200) {
                setUsersArr(response.data.users);
            }
            if (localUserData) {
                setUserData(JSON.parse(localUserData));
            }
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    };

    // Store user data in AsyncStorage
    const storeUserData = async (userData) => {
        try {
            setUserData(userData);
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
    const signupUser = async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/signup`, data);
            if (response.status === 201) {
                const { token, userData } = response.data;
                await AsyncStorage.setItem('authToken', token);
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
                setUserData(userData);
                return response.data.message;
            }
        } catch (error) {
            console.error('Signup failed:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Signup failed');
        }
    };

    // API: User Login
    const loginUser = async (email, password) => {
        try {
            // Check if the user exists in usersArr
            const user = usersArr.find((user) => user.email === email);
            if (!user) {
                throw new Error('User not found');
            }

            // Proceed with API login
            const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
            if (response.status === 200) {
                const { token, userData } = response.data;
                await AsyncStorage.setItem('authToken', token);
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
                setUserData(userData);
                return response.data;
            }
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Login failed');
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
            if (userData?.email) {
                const token = await AsyncStorage.getItem('authToken'); // Retrieve the token from AsyncStorage
                const response = await axios.get(`${API_BASE_URL}/events`, {
                    headers: { 
                        email: userData.email,
                        Authorization: `Bearer ${token}` // Include the token in the headers
                    }
                });
                const dbEvents = response.data.events;
                setEvents(dbEvents);
                await storeEvents(dbEvents);
            }
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
                loginUser,
                resendOTP,
                syncEventsWithDB,
                pushEventsToDB,
                loadUserData,
                usersArr,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
