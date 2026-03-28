const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Create a new booking
exports.createBooking = async (req, res) => {
    const { guideId, date, totalPrice, duration, hotelStay, hotelCheckIn, hotelCheckOut, hotelNights, hotelPrice } = req.body;

    try {
        const guide = await User.findById(guideId);
        if (!guide || guide.role !== 'guide') {
            return res.status(404).json({ message: 'Guide not found' });
        }

        // --- NEW: Backend Check for Blocked Dates ---
        const bookingDateStr = new Date(date).toISOString().split('T')[0];
        const alreadyBlocked = guide.guideProfile?.blockedDates?.some(d =>
            new Date(d).toISOString().split('T')[0] === bookingDateStr
        );

        if (alreadyBlocked) {
            return res.status(400).json({ message: 'Guide is already booked or unavailable on this date' });
        }

        const bookingData = {
            tourist: req.user.id,
            guide: guideId,
            date,
            duration: duration || 1,
            totalPrice,
            status: 'confirmed'
        };

        // Add hotel stay fields if provided
        if (hotelStay) {
            bookingData.hotelStay = hotelStay;
            bookingData.hotelCheckIn = hotelCheckIn;
            bookingData.hotelCheckOut = hotelCheckOut;
            bookingData.hotelNights = hotelNights || 0;
            bookingData.hotelPrice = hotelPrice || 0;
        }

        const booking = new Booking(bookingData);
        await booking.save();

        // --- NEW: Automatically block the date for the guide ---
        if (!guide.guideProfile.blockedDates) {
            guide.guideProfile.blockedDates = [];
        }
        guide.guideProfile.blockedDates.push(new Date(date));
        await guide.save();

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
    try {
        console.log(`Getting bookings for user: ${req.user.id}`);
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`User Role: ${user.role}`);
        let bookings;
        if (user.role === 'guide') {
            bookings = await Booking.find({ guide: req.user.id }).populate('tourist', 'name email').populate('hotelStay');
        } else {
            bookings = await Booking.find({ tourist: req.user.id }).populate('guide', 'name email guideProfile').populate('hotelStay');
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

        // Store old date to unblock
        const oldDate = new Date(booking.date).toISOString().split('T')[0];
        const targetGuideId = booking.guide;

        booking.status = 'cancelled';
        await booking.save();

        // --- NEW: Automatically unblock the date for the guide ---
        const guide = await User.findById(targetGuideId);
        if (guide && guide.guideProfile && guide.guideProfile.blockedDates) {
            guide.guideProfile.blockedDates = guide.guideProfile.blockedDates.filter(d =>
                new Date(d).toISOString().split('T')[0] !== oldDate
            );
            await guide.save();
            console.log(`Date ${oldDate} unblocked automatically for guide ${guide.name}`);
        }

        console.log('Booking cancelled successfully');
        res.json(booking);
    } catch (err) {
        console.error('Cancel Error:', err.message);
        res.status(500).send('Server Error');
    }
};

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

        // Store old and new dates for unblocking/blocking
        const oldDateStr = new Date(booking.date).toISOString().split('T')[0];
        const newDateStr = new Date(date).toISOString().split('T')[0];
        const targetGuideId = booking.guide;

        // Force update fields
        booking.date = date;
        booking.duration = Number(duration);
        booking.totalPrice = Number(totalPrice);
        booking.status = 'confirmed';

        await booking.save();

        // --- NEW: Update guide blocked dates ---
        const guide = await User.findById(targetGuideId);
        if (guide && guide.guideProfile) {
            if (!guide.guideProfile.blockedDates) guide.guideProfile.blockedDates = [];

            // 1. Remove old date
            guide.guideProfile.blockedDates = guide.guideProfile.blockedDates.filter(d =>
                new Date(d).toISOString().split('T')[0] !== oldDateStr
            );

            // 2. Add new date (if not already there)
            const alreadyBlocked = guide.guideProfile.blockedDates.some(d =>
                new Date(d).toISOString().split('T')[0] === newDateStr
            );
            if (!alreadyBlocked) {
                guide.guideProfile.blockedDates.push(new Date(date));
            }

            await guide.save();
            console.log(`Availability updated: Freed ${oldDateStr}, Blocked ${newDateStr}`);
        }

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
