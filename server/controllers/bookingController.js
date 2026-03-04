const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Create a new booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
    const { guideId, date, totalPrice } = req.body;

    try {
        const guide = await User.findById(guideId);
        if (!guide || guide.role !== 'guide') {
            return res.status(404).json({ message: 'Guide not found' });
        }

        const booking = new Booking({
            tourist: req.user.id,
            guide: guideId,
            date,
            duration: req.body.duration || 1, // Default to 1 hour if not specified
            totalPrice,
            status: 'confirmed' // Auto-confirming for now/mock payment
        });

        await booking.save();

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my
// @desc    Get my bookings
// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
    try {
        console.log(`Getting bookings for user: ${req.user.id}`);
        // Fetch user to get reliable role
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`User Role: ${user.role}`);
        let bookings;
        if (user.role === 'guide') {
            bookings = await Booking.find({ guide: req.user.id }).populate('tourist', 'name email');
        } else {
            // Check if user ID is being saved correctly in booking.tourist
            bookings = await Booking.find({ tourist: req.user.id }).populate('guide', 'name email guideProfile');
        }
        console.log(`Found ${bookings.length} bookings`);
        res.json(bookings);
    } catch (err) {
        console.error('GetBookings Error:', err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
    try {
        console.log(`Cancelling booking ${req.params.id} for user ${req.user.id}`);
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            console.log('Booking not found');
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Ensure user owns the booking
        if (booking.tourist.toString() !== req.user.id) {
            console.log(`Authorization failed. Owner: ${booking.tourist}, Requestor: ${req.user.id}`);
            return res.status(401).json({ message: 'Not authorized' });
        }

        booking.status = 'cancelled';
        await booking.save();
        console.log('Booking cancelled successfully');
        res.json(booking);
    } catch (err) {
        console.error('Cancel Error:', err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Reschedule a booking
// @route   PUT /api/bookings/:id/reschedule
// @desc    Reschedule a booking
// @route   PUT /api/bookings/:id/reschedule
exports.rescheduleBooking = async (req, res) => {
    try {
        console.log("Reschedule Request Body:", req.body);
        const { date, duration, totalPrice } = req.body;

        console.log(`Rescheduling booking ${req.params.id} to ${date} for user ${req.user.id}`);
        console.log(`New Duration: ${duration}, New Price: ${totalPrice}`);

        let booking = await Booking.findById(req.params.id);
        if (!booking) {
            console.log('Booking not found');
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.tourist.toString() !== req.user.id) {
            console.log(`Authorization failed. Owner: ${booking.tourist}, Requestor: ${req.user.id}`);
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Force update fields
        booking.date = date;
        booking.duration = Number(duration);
        booking.totalPrice = Number(totalPrice);
        booking.status = 'confirmed';

        await booking.save();

        // Re-fetch to ensure clean population
        const updatedBooking = await Booking.findById(req.params.id)
            .populate('guide', 'name email guideProfile')
            .populate('tourist', 'name email');

        console.log('Booking rescheduled successfully:', updatedBooking);
        res.json(updatedBooking);
    } catch (err) {
        console.error('Reschedule Error:', err.message);
        res.status(500).send('Server Error');
    }
};
