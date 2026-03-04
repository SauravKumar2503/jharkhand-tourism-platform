import axios from 'axios';

const API_URL = 'http://localhost:5001/api/bookings/';

const createBooking = async (bookingData, token) => {
    const config = {
        headers: {
            'x-auth-token': token,
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL, bookingData, config);
    return response.data;
};

const getMyBookings = async (token) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
        }
    };
    const response = await axios.get(API_URL + 'my', config);
    return response.data;
};

const cancelBooking = async (id, token) => {
    const config = {
        headers: {
            'x-auth-token': token,
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.put(`${API_URL}${id}/cancel`, {}, config);
    return response.data;
};

const rescheduleBooking = async (id, date, duration, totalPrice, token) => {
    const config = {
        headers: {
            'x-auth-token': token,
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.put(`${API_URL}${id}/reschedule`, { date, duration, totalPrice }, config);
    return response.data;
};

const bookingService = {
    createBooking,
    getMyBookings,
    cancelBooking,
    rescheduleBooking
};

export default bookingService;
