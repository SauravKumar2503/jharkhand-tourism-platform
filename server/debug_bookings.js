const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Booking = require('./models/Booking');

dotenv.config();

const debugBookings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Find Ramesh
        const ramesh = await User.findOne({ email: 'ramesh@guide.com' });
        if (!ramesh) {
            console.log('Ramesh not found');
            process.exit(1);
        }
        console.log(`Ramesh ID: ${ramesh._id}`);

        // Find Bookings
        const bookings = await Booking.find({ guide: ramesh._id });
        console.log(`Found ${bookings.length} bookings for Ramesh.`);

        bookings.forEach(b => {
            console.log(`Booking ID: ${b._id}, Tourist: ${b.tourist}, Status: ${b.status}, Price: ${b.totalPrice}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debugBookings();
