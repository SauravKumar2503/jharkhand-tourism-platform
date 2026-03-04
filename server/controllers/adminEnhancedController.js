const HeritageSite = require('../models/HeritageSite');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// === HERITAGE SITES ===

// @desc    Get all heritage sites
// @route   GET /api/heritage
exports.getAllSites = async (req, res) => {
    try {
        const sites = await HeritageSite.find().sort({ createdAt: -1 });
        res.json(sites);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a heritage site
// @route   POST /api/heritage
exports.createSite = async (req, res) => {
    try {
        const { name, description, location, images, vrLink } = req.body;

        let newSite = new HeritageSite({
            name,
            description,
            location,
            images,
            vrLink
        });

        const site = await newSite.save();
        res.json(site);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a heritage site
// @route   DELETE /api/heritage/:id
exports.deleteSite = async (req, res) => {
    try {
        await HeritageSite.findByIdAndDelete(req.params.id);
        res.json({ message: 'Site removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// === ADMIN USER MANAGEMENT (Add Guide) ===

// @desc    Create a new user (Guide/Admin)
// @route   POST /api/admin/users
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Initialize guide profile if role is guide
        if (role === 'guide') {
            user.guideProfile = {
                hourlyRate: 500,
                experienceYears: 0,
                availability: true
            };
        }

        await user.save();
        res.json({ message: 'User created successfully', user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
