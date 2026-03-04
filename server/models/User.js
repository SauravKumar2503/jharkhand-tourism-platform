const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['tourist', 'guide', 'admin'],
        default: 'tourist'
    },
    isApproved: {
        type: Boolean,
        default: true  // tourists auto-approved, guides set to false on registration
    },
    // Dynamic profile data based on role
    touristProfile: {
        preferences: [String], // e.g., ["nature", "temples"]
        bookings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        }]
    },
    guideProfile: {
        bio: String,
        languages: [String],
        experienceYears: Number,
        hourlyRate: {
            type: Number,
            default: 500
        },
        blockedDates: [Date], // Dates when the guide is unavailable
        availability: {
            type: Boolean,
            default: true
        },
        rating: {
            type: Number,
            default: 0
        },
        reviewCount: {
            type: Number,
            default: 0
        },
        certifications: [{
            name: String,
            issuer: String,
            date: Date
        }],
        govIdHash: {
            type: String,
            default: ''
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
