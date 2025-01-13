import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    ScrollView,
    BackHandler,
    Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { globalStyles, colors } from '../assets/styles';
import { ThemeContext } from '../context/ThemeContext';
import { AppContext } from '../context/AppContext';

const EventType = {
    BIRTHDAY: 'birthday',
    APPOINTMENT: 'appointment',
    INTERVIEW: 'interview',
    ANNIVERSARY: 'anniversary',
};

const HomeScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);
    const { MainEventArr, addEvent, deleteEvent, editEvent } = useContext(AppContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEvents, setFilteredEvents] = useState(MainEventArr);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [tempSelectedMonths, setTempSelectedMonths] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editedEvent, setEditedEvent] = useState(null);
    const [errorText, setErrorText] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isLoading, setIsLoading] = useState(true); // New state for loading

    useEffect(() => {
        setFilteredEvents(MainEventArr);
        setIsLoading(false); // Set loading to false after events are loaded
    }, [MainEventArr]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        filterEvents(query, selectedMonths);
    };

    const filterEvents = (query, months) => {
        setFilteredEvents(
            MainEventArr.filter((entry) => {
                const matchesQuery = entry.name.toLowerCase().includes(query.toLowerCase());
                const matchesMonth = months.length
                    ? months.includes(new Date(entry.date).getMonth() + 1)
                    : true;
                return matchesQuery && matchesMonth;
            })
        );
    };

    const toggleMonthSelection = (month) => {
        setTempSelectedMonths((prev) =>
            prev.includes(month)
                ? prev.filter((m) => m !== month)
                : [...prev, month]
        );
    };

    const applyFilters = () => {
        setSelectedMonths(tempSelectedMonths);
        filterEvents(searchQuery, tempSelectedMonths);
        setIsFilterModalVisible(false);
    };

    const openFilterModal = () => {
        setTempSelectedMonths(selectedMonths);
        setIsFilterModalVisible(true);
    };

    const closeFilterModal = () => {
        setTempSelectedMonths([]);
        setIsFilterModalVisible(false);
    };

    const backAction = () => {
        if (editingEvent) {
            Alert.alert('Unsaved Changes', 'Do you want to save your changes?', [
                { text: 'No', onPress: () => setEditingEvent(null), style: 'cancel' },
                { text: 'Yes', onPress: saveEvent },
            ]);
            return true;
        }
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
    };

    useFocusEffect(
        React.useCallback(() => {
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction
            );
            return () => backHandler.remove();
        }, [editingEvent])
    );

    const gotToAddEvents = () => {
        navigation.navigate('Addevent');
    };

    const getTypeStyle = (type) => {
        switch (type) {
            case EventType.BIRTHDAY:
                return { color: colors.birthday };
            case EventType.APPOINTMENT:
                return { color: colors.appointment };
            case EventType.INTERVIEW:
                return { color: colors.interview };
            case EventType.ANNIVERSARY:
                return { color: colors.anniversary };
            default:
                return { color: theme.colors.text };
        }
    };

    const startEditing = (event) => {
        setEditingEvent(event.id);
        setEditedEvent({ ...event });
        setErrorText('');
    };

    const saveEvent = () => {
        if (!isValidDate(editedEvent.date)) {
            setErrorText('Please enter a valid date in YYYY-MM-DD format.');
            return;
        }
        if (editedEvent.name.length > 50) {
            setErrorText('The name should not exceed 50 characters.');
            return;
        }
        editEvent(editingEvent, editedEvent);
        cancelEditing();
    };

    const isValidDate = (dateString) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateString.match(regex)) return false;
        const date = new Date(dateString);
        const timestamp = date.getTime();
        if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;
        return dateString === date.toISOString().split('T')[0];
    };

    const cancelEditing = () => {
        setEditingEvent(null);
        setEditedEvent(null);
        setErrorText('');
    };

    const handleDeleteEvent = (id) => {
        Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: () => deleteEvent(id) },
        ]);
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        setFilteredEvents((prevEvents) =>
            [...prevEvents].sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return newSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            })
        );
    };

    return (
        <View
            style={[globalStyles.container, { backgroundColor: theme.colors.background }]}
        >
            {isLoading ? (
                <Text style={[styles.countText, { color: theme.colors.text }]}>Loading...</Text>
            ) : (
                <>
                    <Text style={[styles.countText, { color: theme.colors.text }]}>
                        Total Events: {filteredEvents.length}
                    </Text>
                    <View style={[styles.searchContainer, { backgroundColor: theme.colors.background }]}>
                        <TextInput
                            style={[styles.searchBar, { color: theme.colors.text }]}
                            placeholder="Search by name"
                            value={searchQuery}
                            onChangeText={handleSearch}
                            placeholderTextColor={theme.colors.text}
                        />
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={handleSort}>
                                <FontAwesome name={sortOrder === 'asc' ? 'sort-amount-asc' : 'sort-amount-desc'} size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openFilterModal}>
                                <FontAwesome name="filter" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Modal
                        transparent
                        visible={isFilterModalVisible}
                        animationType="slide"
                        onRequestClose={closeFilterModal}
                    >
                        <TouchableWithoutFeedback onPress={closeFilterModal}>
                            <View style={[modalStyles.modalContainer, { backgroundColor: theme.colors.overlay }]}>
                                <TouchableWithoutFeedback>
                                    <View style={[modalStyles.modalContent, { backgroundColor: theme.colors.background }]}>
                                        <View style={modalStyles.modalHeader}>
                                            <TouchableOpacity onPress={() => setTempSelectedMonths([])}>
                                                <Text style={globalStyles.anchor}>Remove Filters</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={[modalStyles.modalTitle, { color: theme.colors.text }]}>
                                            Select Months
                                        </Text>
                                        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                                            {Array.from({ length: 12 }, (_, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    onPress={() => toggleMonthSelection(index + 1)}
                                                    style={[
                                                        modalStyles.month,
                                                        { borderColor: theme.colors.text },
                                                        tempSelectedMonths.includes(index + 1) && {
                                                            backgroundColor: theme.colors.highlight,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            color: tempSelectedMonths.includes(index + 1)
                                                                ? colors.text3
                                                                : theme.colors.text,
                                                        }}
                                                    >
                                                        {new Date(0, index).toLocaleString('default', { month: 'long' })}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                        <TouchableOpacity onPress={applyFilters} style={globalStyles.button}>
                                            <Text style={globalStyles.buttonText}>Apply</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    <FlatList
                        data={filteredEvents}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={[styles.eventItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.text }]}>
                                <View style={styles.eventDetails}>
                                    {editingEvent === item.id ? (
                                        <>
                                            <TextInput
                                                style={[globalStyles.input, globalStyles.inputContainer, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
                                                value={editedEvent.name}
                                                onChangeText={(text) => setEditedEvent({ ...editedEvent, name: text })}
                                                maxLength={50}
                                            />
                                            <TextInput
                                                style={[globalStyles.input, globalStyles.inputContainer, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
                                                value={editedEvent.date}
                                                onChangeText={(text) => setEditedEvent({ ...editedEvent, date: text })}
                                                placeholder="YYYY-MM-DD"
                                                type="datetime"
                                                placeholderTextColor={theme.colors.textPlaceholder}
                                            />
                                            <Picker
                                                selectedValue={editedEvent.type}
                                                style={[globalStyles.input, globalStyles.inputContainer, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
                                                itemStyle={{ color: theme.colors.text }}
                                                onValueChange={(itemValue) => setEditedEvent({ ...editedEvent, type: itemValue })}
                                            >
                                                {Object.values(EventType).map((type) => (
                                                    <Picker.Item key={type} label={type.toUpperCase()} value={type} />
                                                ))}
                                            </Picker>
                                            {errorText ? (
                                                <Text style={[globalStyles.errorText, { color: theme.colors.error }]}>{errorText}</Text>
                                            ) : null}
                                        </>
                                    ) : (
                                        <>
                                            <Text style={[styles.nameText, { color: theme.colors.text }]}>{item.name}</Text>
                                            <Text style={[styles.dateText, { color: theme.colors.text }]}>{item.date}</Text>
                                            <Text style={[styles.typeText, getTypeStyle(item.type)]}>{item.type.toUpperCase()}</Text>
                                        </>
                                    )}
                                </View>
                                <View style={styles.actionIcons}>
                                    {editingEvent === item.id ? (
                                        <>
                                            <TouchableOpacity onPress={saveEvent} style={[styles.icon, { backgroundColor: theme.colors.highlight }]}>
                                                <MaterialIcons name="check" size={30} color="white" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={cancelEditing} style={[styles.icon, { backgroundColor: 'red' }]}>
                                                <MaterialIcons name="close" size={30} color="white" />
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <>
                                            <TouchableOpacity onPress={() => startEditing(item)} style={[styles.icon, { backgroundColor: theme.colors.highlight }]}>
                                                <FontAwesome name="edit" size={30} color="white" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleDeleteEvent(item.id)} style={[styles.icon, { backgroundColor: 'red' }]}>
                                                <FontAwesome name="trash" size={30} color="white" />
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            </View>
                        )}
                        contentContainerStyle={styles.listContainer}
                    />

                    <TouchableOpacity style={globalStyles.button} onPress={gotToAddEvents}>
                        <Text style={globalStyles.buttonText}>Add New Event</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    countText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    searchBar: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 5,
        paddingHorizontal: 8,
    },
    listContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    eventItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 5,
    },
    eventDetails: {
        flex: 1,
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 14,
    },
    typeText: {
        fontSize: 12,
        fontStyle: 'italic',
        textTransform: 'uppercase',
    },
    actionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10, // Add gap between icons
    },
});

const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalContent: {
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxHeight: '80%',
    },
    month: {
        paddingVertical: 10,
        borderBottomWidth: 2,
    },
});

export default HomeScreen;
