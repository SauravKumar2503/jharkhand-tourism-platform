const express = require('express');
const router = express.Router();
const Transport = require('../models/Transport');
const protect = require('../middleware/authMiddleware');

// @route   GET /api/transport
// @desc    Get all transport hubs (public)
router.get('/', async (req, res) => {
    try {
        const transports = await Transport.find({ isActive: true }).sort({ type: 1, city: 1 });
        res.json(transports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/transport
// @desc    Add transport hub (admin)
router.post('/', protect, async (req, res) => {
    try {
        const transport = new Transport(req.body);
        await transport.save();
        res.status(201).json(transport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/transport/:id
// @desc    Delete transport hub (admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        await Transport.findByIdAndDelete(req.params.id);
        res.json({ message: 'Transport hub removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
