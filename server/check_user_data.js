const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jharkhand_tourism');
        console.log('MongoDB Connected');

        // Replace with the email from the screenshot
        const email = "xyz@gmail.com";
        const user = await User.findOne({ email });

        if (user) {
            console.log('User Found:', user);
            console.log('Bio:', user.bio);
            console.log('Location:', user.location);
            console.log('Profile Picture:', user.profilePicture);
        } else {
            console.log('User not found');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkUser();
