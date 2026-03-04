const axios = require('axios');

const testMainServer = async () => {
    try {
        // 1. Login to get token
        console.log('Logging in as Ramesh...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'ramesh@guide.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Token obtained.');

        // 2. Fetch Stats from Main Server
        console.log('Requesting /api/guides/stats...');
        const statsRes = await axios.get('http://localhost:5000/api/guides/stats', {
            headers: { 'x-auth-token': token }
        });

        console.log('--- SERVER RESPONSE ---');
        console.log(JSON.stringify(statsRes.data, null, 2));
        console.log('-----------------------');

    } catch (err) {
        console.error('--- REQUEST FAILED ---');
        if (err.response) {
            console.error(`Status: ${err.response.status}`);
            console.error('Data:', err.response.data);
        } else {
            console.error(err.message);
        }
        console.error('----------------------');
        // Hint: If connection refused, server is OFF.
    }
};

testMainServer();
