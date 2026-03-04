const axios = require('axios');

const checkServer = async () => {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'ramesh@guide.com',
            password: 'password123'
        });
        const token = loginRes.data.token;

        // 2. Get Stats
        console.log('Fetching Stats...');
        const res = await axios.get('http://localhost:5000/api/guides/stats', {
            headers: { 'x-auth-token': token }
        });

        console.log('Status:', res.status);
        console.log('Type:', typeof res.data);
        console.log('Data:', JSON.stringify(res.data, null, 2));

        if (typeof res.data === 'string') {
            console.log("⚠️ WARNING: Server returned a STRING. This likely means OLD CODE (Server Error html/text).");
        } else if (res.data.totalBookings === 0) {
            console.log("ℹ️ INFO: Server returned JSON, but counts are 0. Logic/Data issue.");
        } else {
            console.log("✅ SUCCESS: Server returned JSON with data.");
        }

    } catch (err) {
        console.log('Error:', err.message);
        if (err.response) {
            console.log('Response Status:', err.response.status);
            console.log('Response Data:', err.response.data);
        }
    }
};

checkServer();
