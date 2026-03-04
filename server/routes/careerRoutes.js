const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');
const upload = require('../middleware/uploadMiddleware');
const protect = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

// @route   POST /api/career/apply
// @desc    Submit job application
// @access  Public
router.post('/apply', upload.single('resume'), careerController.submitApplication);

// @route   GET /api/career/applications
// @desc    Get all job applications (Admin)
// @access  Private/Admin
router.get('/applications', protect, admin, careerController.getAllApplications);

// @route   DELETE /api/career/applications/:id
// @desc    Delete a job application (Admin)
// @access  Private/Admin
router.delete('/applications/:id', protect, admin, careerController.deleteApplication);

module.exports = router;
