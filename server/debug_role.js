const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Booking = require('./models/Booking');

dotenv.config();

const debugRole = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // 1. Check Ramesh
        const ramesh = await User.findOne({ email: 'ramesh@guide.com' });
        if (!ramesh) {
            console.log('Ramesh not found');
            process.exit(1);
        }
        console.log(`Ramesh: ${ramesh.name}`);
        console.log(`Role: '${ramesh.role}'`); // Check for exact string match
        console.log(`ID: ${ramesh._id}`);

        // 2. Simulate extraction
        const guideBookings = await Booking.find({ guide: ramesh._id });
        console.log(`Bookings found via guide ID: ${guideBookings.length}`);

        // 3. Simulate Controller Logic
        let bookings;
        if (ramesh.role === 'guide') {
            console.log("Controller Logic: Role is correct ('guide')");
            bookings = await Booking.find({ guide: ramesh._id }).populate('tourist', 'name email');
        } else {
            console.log(`Controller Logic: Role mismatch! Found '${ramesh.role}' which is not === 'guide'`);
            bookings = await Booking.find({ tourist: ramesh._id });
        }
        console.log(`Controller simulated result count: ${bookings.length}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debugRole();
