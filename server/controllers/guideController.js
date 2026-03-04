const User = require('../models/User');
const Booking = require('../models/Booking');
const TourPackage = require('../models/TourPackage');
const Review = require('../models/Review');

// @desc    Update Guide Profile (Bio, Rate, Availability, Blocked Dates)
// @route   PUT /api/guide/profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { name, bio, hourlyRate, experienceYears, languages, blockedDates } = req.body;

        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'guide') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update Basic Info
        if (name) user.name = name;
        if (req.file) {
            user.profilePicture = `/uploads/${req.file.filename}`;
        }

        // Update Guide Profile
        if (bio) user.guideProfile.bio = bio;
        if (hourlyRate) user.guideProfile.hourlyRate = Number(hourlyRate);
        if (experienceYears) user.guideProfile.experienceYears = Number(experienceYears);

        // Handle languages (can be array or comma-separated string if from FormData)
        if (languages) {
            user.guideProfile.languages = Array.isArray(languages)
                ? languages
                : languages.split(',').map(l => l.trim());
        }

        if (blockedDates) user.guideProfile.blockedDates = blockedDates;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get Guide Dashboard Stats
// @route   GET /api/guide/stats
exports.getGuideStats = async (req, res) => {
    try {
        console.log(`Fetching stats for user ID token: ${req.user.id}`);
        // Ensure user exists and get valid ObjectId keys
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Use user._id from DB to ensure it matches the schema format exactly
        const bookings = await Booking.find({ guide: user._id });
        console.log(`Found ${bookings.length} bookings for stats (User: ${user.name}).`);

        const totalEarnings = bookings
            .filter(b => b.status === 'completed' || b.status === 'confirmed')
            .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

        const completedTours = bookings.filter(b => b.status === 'completed').length;
        const upcomingTours = bookings.filter(b => b.status === 'confirmed').length;
        const cancelledTours = bookings.filter(b => b.status === 'cancelled').length;

        console.log('Stats calculated successfully');

        res.json({
            totalEarnings,
            completedTours,
            upcomingTours,
            cancelledTours,
            totalBookings: bookings.length
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message, stack: err.stack });
    }
};

// @desc    Create a Tour Package
// @route   POST /api/guide/packages
exports.createPackage = async (req, res) => {
    try {
        const { title, description, price, duration, locations, images } = req.body;

        const newPackage = new TourPackage({
            guide: req.user.id,
            title,
            description,
            price,
            duration,
            locations,
            images
        });

        const package = await newPackage.save();
        res.json(package);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get All Packages for Logged-In Guide
// @route   GET /api/guide/packages
exports.getMyPackages = async (req, res) => {
    try {
        const packages = await TourPackage.find({ guide: req.user.id });
        res.json(packages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get Packages by Guide ID (Public)
// @route   GET /api/guides/:guideId/packages
exports.getPackagesByGuideId = async (req, res) => {
    try {
        const packages = await TourPackage.find({ guide: req.params.id });
        res.json(packages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a Package
// @route   DELETE /api/guide/packages/:id
exports.deletePackage = async (req, res) => {
    try {
        const package = await TourPackage.findById(req.params.id);
        if (!package) return res.status(404).json({ message: 'Package not found' });

        if (package.guide.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await package.deleteOne();
        res.json({ message: 'Package removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get Reviews for Guide
// @route   GET /api/guide/reviews
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ guide: req.user.id })
            .populate('tourist', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Reply to a Review
// @route   PUT /api/guide/reviews/:id/reply
exports.replyToReview = async (req, res) => {
    try {
        const { reply } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) return res.status(404).json({ message: 'Review not found' });
        if (review.guide.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        review.reply = reply;
        await review.save();
        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get All Guides (Public)
// @route   GET /api/guides
exports.getAllGuides = async (req, res) => {
    try {
        const guides = await User.find({ role: 'guide', isApproved: true }).select('-password');
        res.json(guides);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get Guide by ID (Public)
// @route   GET /api/guides/:id
exports.getGuideById = async (req, res) => {
    try {
        const guide = await User.findById(req.params.id).select('-password');
        if (!guide || guide.role !== 'guide') {
            return res.status(404).json({ message: 'Guide not found' });
        }
        res.json(guide);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
