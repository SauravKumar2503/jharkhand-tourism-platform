const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkGuides = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jharkhand_tourism');
        console.log('MongoDB Connected');

        const guides = await User.find({ role: 'guide' });

        guides.forEach(guide => {
            console.log(`Name: ${guide.name}, Email: ${guide.email}, Profile Picture: "${guide.profilePicture}"`);
        });

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkGuides();
