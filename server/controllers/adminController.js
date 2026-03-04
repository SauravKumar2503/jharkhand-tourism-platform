const User = require('../models/User');
const Booking = require('../models/Booking');
const MarketplaceItem = require('../models/MarketplaceItem');
const TourPackage = require('../models/TourPackage');

// @desc    Get system stats (enhanced)
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalGuides = await User.countDocuments({ role: 'guide', isApproved: true });
        const pendingGuides = await User.countDocuments({ role: 'guide', isApproved: false });
        const totalBookings = await Booking.countDocuments();
        const totalRevenue = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const totalMarketItems = await MarketplaceItem.countDocuments();
        const totalPackages = await TourPackage.countDocuments();

        res.json({
            users: totalUsers,
            guides: totalGuides,
            pendingGuides,
            bookings: totalBookings,
            revenue: totalRevenue[0]?.total || 0,
            marketItems: totalMarketItems,
            packages: totalPackages
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Approve guide registration
// @route   PUT /api/admin/guides/:id/approve
exports.approveGuide = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== 'guide') {
            return res.status(404).json({ message: 'Guide not found' });
        }
        user.isApproved = true;
        await user.save();
        res.json({ message: 'Guide approved successfully', user: { id: user.id, name: user.name, isApproved: true } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Reject (delete) guide registration
// @route   DELETE /api/admin/guides/:id/reject
exports.rejectGuide = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== 'guide') {
            return res.status(404).json({ message: 'Guide not found' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Guide registration rejected and removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all bookings (admin view)
// @route   GET /api/admin/bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('tourist', 'name email')
            .populate('guide', 'name email')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update booking status (admin)
// @route   PUT /api/admin/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('tourist', 'name email').populate('guide', 'name email');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all marketplace items (admin)
// @route   GET /api/admin/marketplace
exports.getAllMarketplace = async (req, res) => {
    try {
        const items = await MarketplaceItem.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create marketplace item (admin)
// @route   POST /api/admin/marketplace
exports.createMarketplaceItem = async (req, res) => {
    try {
        const item = new MarketplaceItem(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete marketplace item (admin)
// @route   DELETE /api/admin/marketplace/:id
exports.deleteMarketplaceItem = async (req, res) => {
    try {
        await MarketplaceItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Marketplace item removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all tour packages (admin)
// @route   GET /api/admin/packages
exports.getAllPackages = async (req, res) => {
    try {
        const packages = await TourPackage.find()
            .populate('guide', 'name email')
            .sort({ createdAt: -1 });
        res.json(packages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete tour package (admin)
// @route   DELETE /api/admin/packages/:id
exports.deletePackage = async (req, res) => {
    try {
        await TourPackage.findByIdAndDelete(req.params.id);
        res.json({ message: 'Package removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
