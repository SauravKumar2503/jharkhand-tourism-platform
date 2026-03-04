const express = require('express');
const router = express.Router();
const { getAllSites, createSite, deleteSite, createUser } = require('../controllers/adminEnhancedController');
const protect = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

// Public Routes
router.get('/', getAllSites);

// Admin Routes for Sites
router.post('/', protect, admin, createSite);
router.delete('/:id', protect, admin, deleteSite);

// Admin Routes for Users (Extending functionality)
router.post('/users', protect, admin, createUser);

module.exports = router;
