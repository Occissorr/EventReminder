import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../assets/constants';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { checkInternetConnectivity } from '../utils/network.js';
import { scheduleNotifications } from '../utils/NotificationsManager'; // Import scheduleNotifications

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [MainEventArr, setEvents] = useState([]);
    const [userData, setUserData] = useState(null);
    const [usersArr, setUsersArr] = useState([]);
    const [isConnected, setIsConnected] = useState(true);
    const [isDirty, setIsDirty] = useState(false);

    // Load events from AsyncStorage
    const loadEvents = async () => {
        try {
            const localEvents = await AsyncStorage.getItem('events');
            if (localEvents) {
                setEvents(JSON.parse(localEvents));
            }
        } catch (e) {
            console.log('Error loading events:', e);
        }
    };

    // Store events in AsyncStorage
    const storeEvents = async (events) => {
        try {
            await AsyncStorage.setItem('events', JSON.stringify(events));
        } catch (e) {
            console.log('Error storing events:', e);
        }
    };

    // Add a new event
    const addEvent = async (newEvent) => {
        const updatedEvents = [...MainEventArr, newEvent];
        setEvents(updatedEvents);
        await storeEvents(updatedEvents);
        setIsDirty(true);
    };

    // Delete an event
    const deleteEvent = async (id) => {
        const updatedEvents = MainEventArr.filter((event) => event.id !== id);
        setEvents(updatedEvents);
        await storeEvents(updatedEvents);
        setIsDirty(true);
    };

    // Edit an event
    const editEvent = async (id, editedEvent) => {
        const updatedEvents = MainEventArr.map((event) =>
            event.id === id ? { ...event, ...editedEvent } : event
        );
        setEvents(updatedEvents);
        await storeEvents(updatedEvents);
        setIsDirty(true);
    };

    // Load user data from AsyncStorage
    const loadUserData = async () => {
        try {
            const localUserData = await AsyncStorage.getItem('userData');
            if (localUserData) {
                setUserData(JSON.parse(localUserData));
            }else{
                const response = await axios.get(`${API_BASE_URL}/get-users`);
                if (response.status === 200) {
                    setUsersArr(response.data['users']);
                    if(data !== '') {
                        const user = response.data['users'].find(user => user.email === userData.email);
                        if(user){
                            setUserData(user);
                        }
                    }
                }
            }
        } catch (e) {
            console.log('Error loading user data:', e);
        }
    };

    // Store user data in AsyncStorage
    const storeUserData = async (userData) => {
        try {
            if (userData) {
                setUserData(userData);
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
            } else {
                console.log('User data is undefined, not storing in AsyncStorage.');
            }
        } catch (error) {
            console.log('Failed to store user data:', error);
        }
    };

    // Remove user data from AsyncStorage
    const removeUserData = async () => {
        try {
            if (userData?.email) {
                const updatedUserData = { ...userData, loggedIn: false };
                await axios.post(`${API_BASE_URL}/update-user`, updatedUserData);
            }
            await AsyncStorage.removeItem('userData');
            setUserData(null);
        } catch (error) {
            console.log('Failed to remove user data:', error);
        }
    };

    // Store OTP in AsyncStorage
    const storeOTP = async (otp) => {
        try {
            await AsyncStorage.setItem('otp', otp);
        } catch (e) {
            console.log('Error storing OTP:', e);
        }
    };

    // Remove OTP from AsyncStorage
    const removeOTP = async () => {
        try {
            await AsyncStorage.removeItem('otp');
        } catch (e) {
            console.log('Error removing OTP:', e);
        }
    };

    // Store token in AsyncStorage
    const storeToken = async (token) => {
        try {
            await AsyncStorage.setItem('authToken', token);
        } catch (e) {
            console.log('Error storing token:', e);
        }
    };

    //Set Logged In
    const toggleLoggedIn = async (state) => {
        try {
            await AsyncStorage.setItem('loggedIn', state);
        } catch (e) {
            console.log('Error storing token:', e);
        }
    };

    // API: Send OTP
    const sendOTP = async (email) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/send-otp`, { email });
            if (response.status === 200) {
                await storeOTP(response.data.otp);
                return response.data.message;
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to send OTP');
        }
    };

    // API: Verify OTP
    const verifyOTP = async (email, otp, userData = null) => {
        try {
            const sentOtp = await AsyncStorage.getItem('otp');
            if(sentOtp && sentOtp === otp){
                removeOTP();
                if(userData) {
                    toggleLoggedIn(true);
                    return await axios.post(`${API_BASE_URL}/update-user`, userData);
                }
                else return {"message": "Otp Verified"}, 200
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to verify OTP');
        }
    };

    // API: User Login
    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
            if (response.status === 200) {
                const { token, userData } = response.data;
                await storeToken(token);
                if (userData) {
                    await AsyncStorage.setItem('userData', JSON.stringify(userData));
                    setUserData(userData);
                }
            }
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed! Email Does not exist');
        }
    };

    // API: Resend OTP
    const resendOTP = async (email) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/resend-otp`, { email });
            if (response.status === 200) {
                await storeOTP(response.data.otp);
                return response.data.message;
            }
        } catch (error) {
            console.log('Resend OTP failed:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Resend OTP failed');
        }
    };

    // Function to refresh token
    const refreshToken = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.post(`${API_BASE_URL}/refresh-token`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                const newToken = response.data.token;
                await AsyncStorage.setItem('authToken', newToken);
                return newToken;
            }
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('Refresh token endpoint not found.');
            } else {
                console.log('Error refreshing token:', error.response?.data || error.message);
            }
            throw new Error('Failed to refresh token');
        }
    };

    // API: Sync Events with DB
    const getEvents = async (userData) => {
        try {
            if (!userData?.email) {
                console.log('User email is missing.');
                return [];
            }

            const response = await axios.get(`${API_BASE_URL}/get-events`, {
                params: { email: userData.email }
            });

            if (response.status === 200) {
                return response.data.events;
            } else {
                throw new Error('Failed to fetch events');
            }
        } catch (error) {
            console.log('Error fetching events:', error);
            return [];
        }
    };

    // API: Push User Data to DB
    const pushUserDataToDB = async () => {
        try {
            if (userData?.email) {
                const updatedUserData = {
                    email: userData.email,
                    name: userData.name,
                    events: userData.events,
                    mobile: userData.mobile,
                    settings: userData.settings,
                    signupDate: userData.signupDate,
                    password: userData.password
                };
                await axios.post(`${API_BASE_URL}/update-user`, updatedUserData);
            }
        } catch (error) {
            console.log('Error pushing user data to DB:', error);
        }
    };

    // API: Reset Password
    const resetPassword = async (email, newPassword) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/reset-password`, { email, newPassword });
            if (response.status === 200) {
                return response.data.message;
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to reset password');
        }
    };

    // Function to schedule DB syncing
    const scheduleDBSync = () => {
        setInterval(async () => {
            if (isDirty && userData?.email) {
                await pushUserDataToDB();
                setIsDirty(false);
            }
        }, 20 * 60 * 1000); // 20 minutes
    };

    //#region Use Effects

    useEffect(() => {
        checkInternetConnectivity();
        loadUserData();
        loadEvents();
        scheduleDBSync();
    }, []);

    useEffect(() => {
        if (userData) {
            setEvents(userData.events || []);
            scheduleNotifications(userData); // Schedule notifications
        }
    }, [userData]);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    //#endregion

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
                sendOTP,
                verifyOTP,
                loginUser,
                resendOTP,
                pushUserDataToDB,
                loadUserData,
                usersArr,
                isConnected,
                refreshToken,
                getEvents,
                resetPassword,
                toggleLoggedIn,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
