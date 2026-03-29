const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const fixRameshPfp = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jharkhand_tourism');
        console.log('MongoDB Connected');

        // Find Ramesh Kumar and clear his profilePicture
        const result = await User.updateMany(
            { name: "Ramesh Kumar", role: 'guide' },
            { $set: { profilePicture: "" } }
        );

        console.log(`Update Result:`, result);

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

fixRameshPfp();
