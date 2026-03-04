const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing guides (optional: you might want to keep them)
        // await User.deleteMany({ role: 'guide' }); 

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const guides = [
            {
                name: 'Ramesh Kumar',
                email: 'ramesh@guide.com',
                password: hashedPassword,
                role: 'guide',
                guideProfile: {
                    bio: 'Expert in tribal culture and history of Jharkhand.',
                    languages: ['Hindi', 'English', 'Nagpuri'],
                    experienceYears: 10,
                    availability: true,
                    rating: 4.8
                }
            },
            {
                name: 'Sita Devi',
                email: 'sita@guide.com',
                password: hashedPassword,
                role: 'guide',
                guideProfile: {
                    bio: 'Passionate about nature trails and waterfalls.',
                    languages: ['Hindi', 'English', 'Bengali'],
                    experienceYears: 5,
                    availability: true,
                    rating: 4.5
                }
            },
            {
                name: 'John Soren',
                email: 'john@guide.com',
                password: hashedPassword,
                role: 'guide',
                guideProfile: {
                    bio: 'Specialist in spiritual tours and temple history.',
                    languages: ['English', 'Hindi', 'Santhali'],
                    experienceYears: 8,
                    availability: false,
                    rating: 4.9
                }
            }
        ];

        for (const guide of guides) {
            const exists = await User.findOne({ email: guide.email });
            if (!exists) {
                await User.create(guide);
                console.log(`Created guide: ${guide.name}`);
            } else {
                console.log(`Guide already exists: ${guide.name}`);
            }
        }

        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
