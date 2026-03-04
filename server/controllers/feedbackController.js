const Feedback = require('../models/Feedback');
const Booking = require('../models/Booking');

// Keyword-based sentiment analysis
const analyzeSentiment = (text) => {
    const positiveWords = ['amazing', 'wonderful', 'excellent', 'great', 'fantastic', 'beautiful', 'love', 'loved', 'best', 'awesome', 'perfect', 'outstanding', 'incredible', 'brilliant', 'superb', 'delightful', 'recommend', 'enjoy', 'enjoyed', 'happy', 'helpful', 'friendly', 'clean', 'comfortable', 'impressive', 'stunning', 'memorable', 'pleasant'];
    const negativeWords = ['terrible', 'horrible', 'worst', 'bad', 'awful', 'poor', 'disappointing', 'dirty', 'rude', 'expensive', 'overpriced', 'waste', 'boring', 'never', 'unfriendly', 'uncomfortable', 'unsafe', 'broken', 'slow', 'unprofessional', 'scam', 'disgusting', 'cold', 'noisy'];

    const lowerText = text.toLowerCase();
    let score = 0;

    positiveWords.forEach(word => {
        if (lowerText.includes(word)) score += 1;
    });
    negativeWords.forEach(word => {
        if (lowerText.includes(word)) score -= 1;
    });

    let sentiment = 'neutral';
    if (score > 0) sentiment = 'positive';
    if (score < 0) sentiment = 'negative';

    return { sentiment, sentimentScore: score };
};

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
exports.submitFeedback = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;

        const { sentiment, sentimentScore } = analyzeSentiment(comment);

        const feedback = new Feedback({
            userId: req.user.id,
            bookingId: bookingId || null,
            rating,
            comment,
            sentiment,
            sentimentScore
        });

        await feedback.save();
        res.status(201).json(feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all feedback (admin)
// @route   GET /api/feedback
// @access  Private (admin)
exports.getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email')
            .limit(50);
        res.json(feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get feedback analytics
// @route   GET /api/feedback/analytics
// @access  Private (admin)
exports.getAnalytics = async (req, res) => {
    try {
        const totalFeedback = await Feedback.countDocuments();
        const positive = await Feedback.countDocuments({ sentiment: 'positive' });
        const neutral = await Feedback.countDocuments({ sentiment: 'neutral' });
        const negative = await Feedback.countDocuments({ sentiment: 'negative' });

        const avgRating = await Feedback.aggregate([
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        const recentFeedback = await Feedback.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'name');

        res.json({
            totalFeedback,
            sentimentBreakdown: { positive, neutral, negative },
            avgRating: avgRating[0]?.avgRating || 0,
            recentFeedback
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get feedback for the logged-in guide
// @route   GET /api/feedback/guide
// @access  Private (guide)
exports.getGuideFeedback = async (req, res) => {
    try {
        // Find all bookings where this user is the guide
        const guideBookings = await Booking.find({ guide: req.user.id }).select('_id');
        const bookingIds = guideBookings.map(b => b._id);

        // Find all feedback linked to those bookings
        const feedback = await Feedback.find({ bookingId: { $in: bookingIds } })
            .sort({ createdAt: -1 })
            .populate('userId', 'name email profilePicture')
            .populate('bookingId', 'date duration totalPrice');

        // Compute summary stats
        const total = feedback.length;
        const avgRating = total > 0 ? (feedback.reduce((sum, f) => sum + f.rating, 0) / total) : 0;
        const positive = feedback.filter(f => f.sentiment === 'positive').length;
        const neutral = feedback.filter(f => f.sentiment === 'neutral').length;
        const negative = feedback.filter(f => f.sentiment === 'negative').length;

        res.json({
            feedback,
            summary: { total, avgRating: avgRating.toFixed(1), positive, neutral, negative }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
