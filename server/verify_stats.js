const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Booking = require('./models/Booking');

dotenv.config();

const verifyStats = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // 1. Find Ramesh
        const ramesh = await User.findOne({ email: 'ramesh@guide.com' });
        if (!ramesh) {
            console.log('Ramesh not found');
            process.exit(1);
        }
        console.log(`Ramesh ID: ${ramesh._id}`);

        // 2. Find Bookings
        const bookings = await Booking.find({ guide: ramesh._id });
        console.log(`Total Bookings Found in DB: ${bookings.length}`);

        if (bookings.length === 0) {
            console.log("No bookings found. This explains the 0 stats.");
            // Debug: Check if any bookings exist at all?
            const allBookings = await Booking.find({});
            console.log(`Total bookings in ENTIRE DB: ${allBookings.length}`);
            if (allBookings.length > 0) {
                console.log("Sample Booking:", allBookings[0]);
                console.log(`Sample Booking Guide ID: ${allBookings[0].guide}`);
                console.log(`Ramesh ID:             ${ramesh._id}`);
                console.log(`Match? ${allBookings[0].guide.toString() === ramesh._id.toString()}`);
            }
        } else {
            // 3. Calculate Stats Manually
            const totalEarnings = bookings
                .filter(b => b.status === 'completed' || b.status === 'confirmed')
                .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

            const completedTours = bookings.filter(b => b.status === 'completed').length;
            const upcomingTours = bookings.filter(b => b.status === 'confirmed').length;
            const cancelledTours = bookings.filter(b => b.status === 'cancelled').length;

            console.log('--- EXPECTED STATS ---');
            console.log(`Total Bookings: ${bookings.length}`);
            console.log(`Total Earnings: ${totalEarnings}`);
            console.log(`Upcoming:       ${upcomingTours}`);
            console.log(`Completed:      ${completedTours}`);
            console.log('----------------------');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyStats();
