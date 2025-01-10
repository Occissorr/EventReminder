import React, { useState } from 'react';
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
    Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { globalStyles } from '../assets/styles';

const HomeScreen = ({ navigation }) => {
    // Sample data for birthdays
    const [birthdays, setBirthdays] = useState([
        { id: '1', name: 'John Doe', date: '2025-01-15' },
        { id: '2', name: 'Jane Smith', date: '2025-02-20' },
        { id: '3', name: 'Michael Brown', date: '2025-03-10' },
        { id: '4', name: 'Emily Davis', date: '2025-01-25' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBirthdays, setFilteredBirthdays] = useState(birthdays);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [selectedMonths, setSelectedMonths] = useState([]);

    // Filter birthdays based on the search query
    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = birthdays.filter((entry) =>
            entry.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredBirthdays(filtered);
    };

    const toggleMonthSelection = (month) => {
        if (selectedMonths.includes(month)) {
            setSelectedMonths(selectedMonths.filter((m) => m !== month)); // Remove if already selected
        } else {
            setSelectedMonths([...selectedMonths, month]); // Add if not selected
        }
    };

    const applyFilters = () => {
        if (selectedMonths.length === 0) {
            setFilteredBirthdays(birthdays); // Reset filters if no months selected
        } else {
            const filtered = birthdays.filter((entry) => {
                const entryMonth = new Date(entry.date).getMonth() + 1;
                return selectedMonths.includes(entryMonth);
            });
            setFilteredBirthdays(filtered);
        }
        setIsFilterModalVisible(false); // Close modal
    };
    const backAction = () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
            { text: 'Cancel', onPress: () => null, style: 'cancel' },
            { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ]);
        return true; // Prevent default back action
    };

    useFocusEffect(
        React.useCallback(() => {
            // Add the back handler
            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

            return () => backHandler.remove(); // Clean up on blur
        }, [])
    );

    const goToCalendar = () => {
        navigation.navigate('Calendar');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.countText}>
                Total Birthdays: {filteredBirthdays.length}
            </Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search by name"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity
                    style={styles.filterIcon}
                    onPress={() => setIsFilterModalVisible(true)}
                >
                    <FontAwesome name="filter" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                visible={isFilterModalVisible}
                animationType="slide"
                onRequestClose={() => setIsFilterModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsFilterModalVisible(false)}>
                    <View style={modalStyles.modalContainer}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <View style={modalStyles.modalContent}>
                                {/* Header with Remove Filters Button */}
                                <View style={modalStyles.modalHeader}>
                                    <TouchableOpacity onPress={() => setSelectedMonths([])}>
                                        <Text style={modalStyles.removeFiltersText}>Remove Filters</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Modal Title */}
                                <Text style={modalStyles.modalTitle}>Select Months</Text>

                                {/* Scrollable list of months */}
                                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                                    {[...Array(12)].map((_, index) => {
                                        const month = index + 1;
                                        const isSelected = selectedMonths.includes(month);

                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => toggleMonthSelection(month)}
                                                style={[
                                                    modalStyles.month,
                                                    isSelected && modalStyles.selectedMonth,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        modalStyles.monthText,
                                                        isSelected && modalStyles.selectedMonthText,
                                                    ]}
                                                >
                                                    {new Date(0, index).toLocaleString('default', {
                                                        month: 'long',
                                                    })}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>

                                {/* Apply Filters Button */}
                                <TouchableOpacity onPress={applyFilters} style={modalStyles.modalButton}>
                                    <Text style={modalStyles.modalButtonText}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


            {/* Birthday List */}
            <FlatList
                data={filteredBirthdays}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.birthdayItem}>
                        <Text style={styles.nameText}>{item.name}</Text>
                        <Text style={styles.dateText}>{item.date}</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
            />

            {/* Navigate to Calendar Button */}
            <TouchableOpacity style={styles.addButton} onPress={goToCalendar}>
                <Text style={styles.addButtonText}>Add new Birthday</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: globalStyles.primary
    },
    countText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
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
    filterIcon: {
        marginLeft: 10,
    },
    listContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    birthdayItem: {
        padding: 15,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 14,
        color: '#666',
    },
    addButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#88e051',
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent overlay
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '80%',
        maxHeight: '70%',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    removeFiltersText: {
        color: '#007BFF',
        textDecorationLine: 'underline',
        fontSize: 14,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    month: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    selectedMonth: {
        backgroundColor: '#007BFF',
    },
    selectedMonthText: {
        color: '#fff',
    },
});


export default HomeScreen;
