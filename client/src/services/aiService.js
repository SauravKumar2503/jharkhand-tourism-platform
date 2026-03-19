import axios from 'axios';
import API_BASE from '../config';

const API_URL = `${API_BASE}/api/ai/`;

const chatWithAI = async (message, token, language = 'English') => {
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
        }
    };
    const response = await axios.post(API_URL + 'chat', { message, language }, config);
    return response.data;
};

const generateItinerary = async (preferences, token) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
        }
    };
    const response = await axios.post(API_URL + 'itinerary', { preferences }, config);
    return response.data;
};

const getChatHistory = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + 'history', config);
    return response.data;
};

const aiService = {
    chatWithAI,
    generateItinerary,
    getChatHistory
};

export default aiService;
