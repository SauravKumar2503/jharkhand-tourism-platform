const express = require('express');
const router = express.Router();
const {
    updateUserProfile,
    getGuideStats,
    createPackage,
    getMyPackages,
    getPackagesByGuideId,
    deletePackage,
    getReviews,
    replyToReview,
    getAllGuides,
    getGuideById
} = require('../controllers/guideController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Profile & Stats
router.put('/profile', auth, upload.single('profilePicture'), updateUserProfile);
router.get('/stats', auth, getGuideStats);

// Packages (Specific first)
router.post('/packages', auth, createPackage);
router.get('/packages', auth, getMyPackages);
router.delete('/packages/:id', auth, deletePackage);

// Reviews (Specific first)
router.get('/reviews', auth, getReviews);
router.put('/reviews/:id/reply', auth, replyToReview);



// Public Routes (Generic parameters last)
router.get('/', getAllGuides);
router.get('/:id/packages', getPackagesByGuideId);
router.get('/:id', getGuideById);

module.exports = router;
