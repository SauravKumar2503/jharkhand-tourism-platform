const axios = require('axios');

const testPort5001 = async () => {
    try {
        console.log('Testing http://localhost:5001 ...');

        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'ramesh@guide.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Login Successful. Token obtained.');

        // 2. Get Stats
        console.log('Fetching Stats from 5001...');
        const res = await axios.get('http://localhost:5001/api/guides/stats', {
            headers: { 'x-auth-token': token }
        });

        console.log('--- RESPONSE FROM 5001 ---');
        console.log(JSON.stringify(res.data, null, 2));
        console.log('--------------------------');

    } catch (err) {
        console.error('FAILED TO CONNECT TO 5001');
        if (err.code === 'ECONNREFUSED') {
            console.error('Connection Refused! Server is NOT running on 5001.');
        } else if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        } else {
            console.error(err.message);
        }
    }
};

testPort5001();
