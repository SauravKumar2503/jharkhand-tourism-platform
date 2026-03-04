const express = require('express');
const router = express.Router();

// @route   GET /api/test
// @desc    Test API connection
// @access  Public
router.get('/test', (req, res) => {
    res.send({ message: 'Backend is connected manually!' });
});

module.exports = router;
