const express = require('express');
const router = express.Router();
const {
    createHotel,
    getMyHotels,
    getHotelsByGuideId,
    deleteHotel,
    getAllHotels,
    adminCreateHotel,
    adminDeleteHotel
} = require('../controllers/hotelController');
const auth = require('../middleware/authMiddleware');

// Admin routes (specific paths first)
router.get('/all', auth, getAllHotels);
router.post('/admin', auth, adminCreateHotel);
router.delete('/admin/:id', auth, adminDeleteHotel);

// Public route
router.get('/guide/:guideId', getHotelsByGuideId);

// Guide routes (auth required)
router.post('/', auth, createHotel);
router.get('/', auth, getMyHotels);
router.delete('/:id', auth, deleteHotel);

module.exports = router;
