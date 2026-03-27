const mongoose = require('mongoose');

const HotelStaySchema = new mongoose.Schema({
    guide: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotelName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: ''
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    roomType: {
        type: String,
        enum: ['Single', 'Double', 'Suite', 'Deluxe', 'Dormitory'],
        default: 'Double'
    },
    amenities: {
        type: [String],
        default: []
    },
    maxGuests: {
        type: Number,
        default: 2
    },
    description: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('HotelStay', HotelStaySchema);
