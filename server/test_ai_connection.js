const axios = require('axios');

async function testAI() {
    try {
        console.log("Testing connection to Python AI Service at http://localhost:5003/chat...");
        const response = await axios.post('http://localhost:5003/chat', {
            message: "hello"
        });
        console.log("Success! Response:", response.data);
    } catch (error) {
        console.error("Connection Failed:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else if (error.code === 'ECONNREFUSED') {
            console.error("Make sure the Python server is running on port 5002.");
        }
    }
}

testAI();
