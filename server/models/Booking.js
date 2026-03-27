const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    tourist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    guide: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        default: 1
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    hotelStay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HotelStay',
        default: null
    },
    hotelCheckIn: {
        type: Date,
        default: null
    },
    hotelCheckOut: {
        type: Date,
        default: null
    },
    hotelNights: {
        type: Number,
        default: 0
    },
    hotelPrice: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
