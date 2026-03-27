const HotelStay = require('../models/HotelStay');
const User = require('../models/User');

// @desc    Create a hotel listing (Guide)
// @route   POST /api/hotels
exports.createHotel = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'guide') {
            return res.status(401).json({ message: 'Only guides can add hotels' });
        }

        const { hotelName, location, pricePerNight, roomType, amenities, maxGuests, description } = req.body;

        const hotel = new HotelStay({
            guide: req.user.id,
            hotelName,
            location,
            pricePerNight: Number(pricePerNight),
            roomType: roomType || 'Double',
            amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',').map(a => a.trim()) : []),
            maxGuests: Number(maxGuests) || 2,
            description
        });

        await hotel.save();
        res.json(hotel);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get my hotel listings (Guide)
// @route   GET /api/hotels
exports.getMyHotels = async (req, res) => {
    try {
        const hotels = await HotelStay.find({ guide: req.user.id, isActive: true });
        res.json(hotels);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get hotels by guide ID (Public)
// @route   GET /api/hotels/guide/:guideId
exports.getHotelsByGuideId = async (req, res) => {
    try {
        const hotels = await HotelStay.find({ guide: req.params.guideId, isActive: true });
        res.json(hotels);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a hotel listing (Guide)
// @route   DELETE /api/hotels/:id
exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await HotelStay.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        if (hotel.guide.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await hotel.deleteOne();
        res.json({ message: 'Hotel removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// ==================== ADMIN ENDPOINTS ====================

// @desc    Get all hotels (Admin)
// @route   GET /api/hotels/all
exports.getAllHotels = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ message: 'Admin access required' });
        }

        const hotels = await HotelStay.find().populate('guide', 'name email');
        res.json(hotels);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Admin create hotel for any guide
// @route   POST /api/hotels/admin
exports.adminCreateHotel = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ message: 'Admin access required' });
        }

        const { guideId, hotelName, location, pricePerNight, roomType, amenities, maxGuests, description } = req.body;

        // Verify the guide exists
        const guide = await User.findById(guideId);
        if (!guide || guide.role !== 'guide') {
            return res.status(404).json({ message: 'Guide not found' });
        }

        const hotel = new HotelStay({
            guide: guideId,
            hotelName,
            location,
            pricePerNight: Number(pricePerNight),
            roomType: roomType || 'Double',
            amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',').map(a => a.trim()) : []),
            maxGuests: Number(maxGuests) || 2,
            description
        });

        await hotel.save();
        const populated = await HotelStay.findById(hotel._id).populate('guide', 'name email');
        res.json(populated);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Admin delete any hotel
// @route   DELETE /api/hotels/admin/:id
exports.adminDeleteHotel = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ message: 'Admin access required' });
        }

        const hotel = await HotelStay.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        await hotel.deleteOne();
        res.json({ message: 'Hotel removed by admin' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
