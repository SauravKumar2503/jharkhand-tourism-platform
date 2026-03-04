const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate Token
const generateToken = (userId) => {
    return jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role: role || 'tourist',
            isApproved: role === 'guide' ? false : true  // guides need admin approval
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const token = generateToken(user.id);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved
            },
            message: role === 'guide' ? 'Registration successful! Your account is pending admin approval.' : undefined
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Check if guide is approved
        if (user.role === 'guide' && !user.isApproved) {
            return res.status(403).json({ message: 'Your guide account is pending admin approval. Please wait for approval.' });
        }

        const token = generateToken(user.id);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                profilePicture: user.profilePicture
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
// @desc    Update user profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
    try {
        console.log("Updating profile for user:", req.user.id);
        console.log("Request Body:", req.body);
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.bio = req.body.bio || user.bio;
            user.location = req.body.location || user.location;
            user.phone = req.body.phone || user.phone;

            if (req.file) {
                user.profilePicture = `/uploads/${req.file.filename}`;
            } else if (req.body.removeProfilePicture === 'true') {
                user.profilePicture = '';
            }

            const updatedUser = await user.save();

            res.json({
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                bio: updatedUser.bio,
                location: updatedUser.location,
                phone: updatedUser.phone,
                profilePicture: updatedUser.profilePicture, // Return new image path
                token: generateToken(updatedUser.id)
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
