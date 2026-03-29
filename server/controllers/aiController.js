const axios = require('axios');
const Chat = require('../models/Chat');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5003';

// @desc    Chat with AI
// @route   POST /api/ai/chat
exports.chatWithAI = async (req, res) => {
    const { message, language } = req.body;
    const userId = req.user.id;

    try {
        // Save User Message
        const userChat = new Chat({
            user: userId,
            message: message,
            sender: 'user'
        });
        await userChat.save();

        const response = await axios.post(`${AI_SERVICE_URL}/chat`, { 
            message, 
            role: req.user.role || 'tourist',
            language: language || 'English' 
        });
        const botResponse = response.data.response;

        // Save Bot Response
        const botChat = new Chat({
            user: userId,
            message: botResponse,
            sender: 'bot'
        });
        await botChat.save();

        res.json(response.data);
    } catch (err) {
        console.error("AI Service Error:", err.message);
        if (err.code === 'ECONNREFUSED') {
            res.status(503).json({ message: 'AI Service is Offline. Please run the python script.' });
        } else {
            res.status(500).json({ message: 'AI Service Error' });
        }
    }
};

// @desc    Get Chat History
// @route   GET /api/ai/history
exports.getChatHistory = async (req, res) => {
    try {
        const chats = await Chat.find({ user: req.user.id }).sort({ timestamp: 1 });
        res.json(chats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Generate Itinerary
// @route   POST /api/ai/itinerary
exports.generateItinerary = async (req, res) => {
    const { preferences } = req.body;

    try {
        const response = await axios.post(`${AI_SERVICE_URL}/itinerary`, { preferences });
        res.json(response.data);
    } catch (err) {
        console.error("AI Service Error:", err.message);
        res.status(500).json({ message: 'AI Service Unavailable' });
    }
};
