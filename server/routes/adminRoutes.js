const express = require('express');
const router = express.Router();
const {
    getStats,
    getAllUsers,
    deleteUser,
    approveGuide,
    rejectGuide,
    getAllBookings,
    updateBookingStatus,
    getAllMarketplace,
    createMarketplaceItem,
    deleteMarketplaceItem,
    getAllPackages,
    deletePackage
} = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

// Stats
router.get('/stats', protect, admin, getStats);

// Users
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);

// Guide Approval
router.put('/guides/:id/approve', protect, admin, approveGuide);
router.delete('/guides/:id/reject', protect, admin, rejectGuide);

// Bookings
router.get('/bookings', protect, admin, getAllBookings);
router.put('/bookings/:id/status', protect, admin, updateBookingStatus);

// Marketplace
router.get('/marketplace', protect, admin, getAllMarketplace);
router.post('/marketplace', protect, admin, createMarketplaceItem);
router.delete('/marketplace/:id', protect, admin, deleteMarketplaceItem);

// Tour Packages
router.get('/packages', protect, admin, getAllPackages);
router.delete('/packages/:id', protect, admin, deletePackage);

module.exports = router;
