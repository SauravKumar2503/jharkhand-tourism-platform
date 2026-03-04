const axios = require('axios');

const testVersion = async () => {
    try {
        console.log('Checking /api/version on 5001...');
        const res = await axios.get('http://localhost:5001/api/version');
        console.log('Version:', res.data);
    } catch (err) {
        console.error('Failed to get version:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        }
    }
};

testVersion();
