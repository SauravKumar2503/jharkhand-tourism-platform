require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createAdmin() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: 'admin@jharkhandtourism.com' });
    if (existing) {
        console.log('Admin already exists!');
        console.log('Email: admin@jharkhandtourism.com');
        console.log('Password: Admin@123');
        process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    const admin = new User({
        name: 'Admin',
        email: 'admin@jharkhandtourism.com',
        password: hashedPassword,
        role: 'admin',
        isApproved: true
    });

    await admin.save();
    console.log('Admin account created successfully!');
    console.log('Email: admin@jharkhandtourism.com');
    console.log('Password: Admin@123');
    process.exit(0);
}

createAdmin().catch(err => {
    console.error(err);
    process.exit(1);
});
