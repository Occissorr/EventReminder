export const EventType = {
    BIRTHDAY: 'birthday',
    APPOINTMENT: 'appointment',
    INTERVIEW: 'interview',
    ANNIVERSARY: 'anniversary',
};

export const API_BASE_URL = 'https://occasio-ze87.onrender.com';

export const ReminderFrequency = {
    DAILY: 'Daily',
    WEEKLY: 'Weekly',
    MONTHLY: 'Monthly',
};

export const ReminderRange = {
    WEEK: 'Week',
    MONTH: 'Month',
    YEAR: 'Year',
};

export const rangeDays = {
    Weekly: 7,
    Monthly: 30,
    Yearly: 365,
}[range] || 30;

//#region Functions

/**
 * Email Format Validation
 * @param {*} email 
 * @returns 
 */
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

//#endregion