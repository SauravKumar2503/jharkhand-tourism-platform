const mongoose = require('mongoose');

const HeritageSiteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    images: {
        type: [String], // Array of image URLs
        default: []
    },
    vrLink: {
        type: String, // Link to 360 view or component identifier
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('HeritageSite', HeritageSiteSchema);
