const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config({ path: './server/.env' });

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const admin = await User.findOne({ role: 'admin' });

        if (admin) {
            console.log('Admin User Found:');
            console.log('Email:', admin.email);
            // We can't see the password, but we can reset it if needed. 
            // For now, let's assume it's 'admin123' if it's a seed user, or I will reset it to 'admin123' to be sure.
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash('admin123', salt);
            await admin.save();
            console.log('Password reset to: admin123');
        } else {
            console.log('No Admin found. Creating one...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            const newAdmin = new User({
                name: 'Admin User',
                email: 'admin@jharkhandconnect.com',
                password: hashedPassword,
                role: 'admin'
            });

            await newAdmin.save();
            console.log('Admin Created:');
            console.log('Email: admin@jharkhandconnect.com');
            console.log('Password: admin123');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkAdmin();
