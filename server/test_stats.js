const axios = require('axios');

const testStats = async () => {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'ramesh@guide.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Login successful. Token obtained.');

        // 2. Get Stats
        console.log('Fetching Stats...');
        const statsRes = await axios.get('http://localhost:5001/api/guides/stats', {
            headers: { 'x-auth-token': token }
        });
        console.log('Stats Response:', statsRes.data);

        // 3. Get Sub-Bookings (if needed)
        // const bookingsRes = await axios.get('http://localhost:5000/api/bookings/my', {
        //     headers: { 'x-auth-token': token }
        // });
        // console.log('Bookings Response:', bookingsRes.data);

    } catch (err) {
        console.error('Error Status:', err.response?.status);
        console.error('Error Data:', JSON.stringify(err.response?.data, null, 2));
        console.error('Error Message:', err.message);
    }
};

testStats();
