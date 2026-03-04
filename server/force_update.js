const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const forceUpdate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jharkhand_tourism');
        console.log('MongoDB Connected');

        const email = "xyz@gmail.com";
        const user = await User.findOne({ email });

        if (user) {
            console.log('Found user:', user.name);
            console.log('Old Bio:', user.bio);

            user.bio = "Forced Update Bio";
            user.location = "Forced Location";

            const savedUser = await user.save();
            console.log('Saved User Bio:', savedUser.bio);

            // Fetch again to be sure
            const freshUser = await User.findOne({ email });
            console.log('Refetched Bio:', freshUser.bio);
        } else {
            console.log('User not found');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

forceUpdate();
