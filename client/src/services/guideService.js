import axios from 'axios';

const API_URL = 'http://localhost:5001/api/guides/';

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
