const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking, rescheduleBooking } = require('../controllers/bookingController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/reschedule', protect, rescheduleBooking);

module.exports = router;
