const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/authMiddleware');

// @route   POST /api/feedback
// @desc    Submit feedback
// @access  Private
router.post('/', auth, feedbackController.submitFeedback);

// @route   GET /api/feedback/guide
// @desc    Get feedback for the logged-in guide
// @access  Private (guide)
router.get('/guide', auth, feedbackController.getGuideFeedback);

// @route   GET /api/feedback
// @desc    Get all feedback
// @access  Private (admin)
router.get('/', auth, feedbackController.getAllFeedback);

// @route   GET /api/feedback/analytics
// @desc    Get feedback analytics
// @access  Private (admin)
router.get('/analytics', auth, feedbackController.getAnalytics);

module.exports = router;
