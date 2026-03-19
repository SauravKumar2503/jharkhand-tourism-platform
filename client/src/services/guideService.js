import axios from 'axios';
import API_BASE from '../config';

const API_URL = `${API_BASE}/api/guides/`;

const getAllGuides = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const getGuideById = async (id) => {
    const response = await axios.get(API_URL + id);
    return response.data;
};

const getPackagesByGuideId = async (id) => {
    const response = await axios.get(API_URL + id + '/packages');
    return response.data;
};

const guideService = {
    getAllGuides,
    getGuideById,
    getPackagesByGuideId
};

export default guideService;
