const express = require('express');
const router = express.Router();
const { chatWithAI, generateItinerary, getChatHistory } = require('../controllers/aiController');
const protect = require('../middleware/authMiddleware');

router.post('/chat', protect, chatWithAI);
router.get('/history', protect, getChatHistory);
router.post('/itinerary', protect, generateItinerary);

module.exports = router;
