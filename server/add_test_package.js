const mongoose = require('mongoose');
const TourPackage = require('./models/TourPackage');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const addTestPackage = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find the guide (replace with a known guide ID or pick the first one)
        const guide = await User.findOne({ role: 'guide' });

        if (!guide) {
            console.log('No guide found.');
            process.exit(1);
        }

        console.log(`Adding package to guide: ${guide.name} (${guide._id})`);

        const newPackage = new TourPackage({
            guide: guide._id,
            title: "Heritage Walk Special",
            description: "A 3-hour immersive journey through the ancient temples and cultural landmarks.",
            price: 1500,
            duration: 3,
            locations: ["Sun Temple", "Jagannath Temple"],
            images: []
        });

        await newPackage.save();
        console.log('Test package created successfully!');

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

addTestPackage();
