const axios = require('axios');
const Chat = require('../models/Chat');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5003';

// MOCK ATTRACTIONS (Fallback Data)
const ATTRACTIONS = {
    "nature": ["Hundru Falls", "Dalma Wildlife Sanctuary", "Betla National Park"],
    "heritage": ["Jagannath Temple", "Sun Temple", "Pahari Mandir"],
    "spiritual": ["Baidyanath Dham", "Rajrappa Temple", "Itkhori"]
};

const getFallbackChatResponse = (message, role) => {
    const msg = (message || '').toLowerCase();
    
    if (role === 'guide') {
        if (msg.includes('schedule') || msg.includes('tour')) return "You can view your upcoming bookings in your Guide Dashboard under 'My Tours'. Do you need help with a specific date?";
        if (msg.includes('booking') || msg.includes('more')) return "To get more bookings, try adding more competitive packages or improving your bio. I can help you write a better bio if you like!";
        if (msg.includes('profile')) return "You can update your languages, rates, and experience in the 'Edit Profile' section of your dashboard.";
        return "Hello Guide! I'm here to help you manage your profile and tours. How can I assist you today?";
    } else if (role === 'admin') {
        if (msg.includes('stat') || msg.includes('statistics')) return "Platform stats show a 15% increase in tourist registrations this month. Check the Admin Dashboard for detailed charts.";
        if (msg.includes('approval') || msg.includes('pending')) return "There are pending guide applications. You can review them in the 'Guide Management' tab.";
        if (msg.includes('log')) return "System logs are clean. No critical errors reported in the last 24 hours.";
        return "Welcome Admin. I can help you with system overviews, user management, and platform health. What do you need?";
    } else {
        if (msg.includes('hello') || msg.includes('hi')) return "Namaste! Welcome to Jharkhand. I can help you find guides, plan itineraries, or explore attractions.";
        if (msg.includes('plan') || msg.includes('trip')) return "I can help with that! Tell me what you like: Nature, Heritage, or Spiritual?";
        if (msg.includes('nature')) return "Jharkhand is full of waterfalls and forests! You should visit Hundru Falls and Betla National Park.";
        if (msg.includes('heritage')) return "To explore our history, visit the Sun Temple and Jagannath Temple.";
        if (msg.includes('guide')) return "You can browse available experts in the 'Guides' section to find a local who knows the area best.";
        return "I'm your Jharkhand Travel Assistant. Ask me about planning a trip, finding guides, or top attractions!";
    }
};

// @desc    Chat with AI
// @route   POST /api/ai/chat
exports.chatWithAI = async (req, res) => {
    const { message, language } = req.body;
    const userId = req.user.id;
    const role = req.user.role || 'tourist';

    try {
        // Save User Message
        const userChat = new Chat({
            user: userId,
            message: message,
            sender: 'user'
        });
        await userChat.save();

        let botResponse = '';
        try {
            const response = await axios.post(`${AI_SERVICE_URL}/chat`, { 
                message, 
                role,
                language: language || 'English' 
            });
            botResponse = response.data.response;
        } catch (serviceErr) {
            console.warn("Python AI Service Unreachable. Using Node Fallback Controller.");
            botResponse = getFallbackChatResponse(message, role);
        }

        // Save Bot Response
        const botChat = new Chat({
            user: userId,
            message: botResponse,
            sender: 'bot'
        });
        await botChat.save();

        res.json({ response: botResponse });
    } catch (err) {
        console.error("AI Database Error:", err.message);
        res.status(500).json({ message: 'AI Service Error' });
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
        let itineraryData = [];
        try {
            const response = await axios.post(`${AI_SERVICE_URL}/itinerary`, { preferences });
            itineraryData = response.data.itinerary;
        } catch (serviceErr) {
            console.warn("Python AI Service Unreachable. Using Node Itinerary Fallback.");
            const safePrefs = preferences || [];
            let fallbackItinerary = [];
            safePrefs.forEach(pref => {
                if (ATTRACTIONS[pref.toLowerCase()]) {
                    fallbackItinerary = [...fallbackItinerary, ...ATTRACTIONS[pref.toLowerCase()]];
                }
            });
            if (fallbackItinerary.length === 0) {
                fallbackItinerary = ["Hundru Falls", "Jagannath Temple", "Ranchi Lake"];
            }
            itineraryData = [...new Set(fallbackItinerary)];
        }
        res.json({ itinerary: itineraryData });
    } catch (err) {
        console.error("AI Itinerary Error:", err.message);
        res.status(500).json({ message: 'AI Service Error' });
    }
};
