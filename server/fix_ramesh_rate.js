const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const fixRate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Find Ramesh
        const ramesh = await User.findOne({ email: 'ramesh@guide.com' });
        if (ramesh) {
            console.log(`Found Ramesh: ${ramesh.name}`);
            ramesh.guideProfile.hourlyRate = 750; // Distinct value
            await ramesh.save();
            console.log('Updated Ramesh to 750.');
        } else {
            console.log('Ramesh not found.');
        }

        // Verify All
        const guides = await User.find({ role: 'guide' });
        console.log('\n--- Final Rates ---');
        guides.forEach(g => {
            console.log(`${g.name}: ${g.guideProfile.hourlyRate}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixRate();
