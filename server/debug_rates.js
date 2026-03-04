const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const debugRates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const guides = await User.find({ role: 'guide' });

        console.log('\n--- Current Guide Rates ---');
        guides.forEach(g => {
            console.log(`Name: ${g.name}, ID: ${g._id}`);
            console.log(`Rate: ${g.guideProfile?.hourlyRate}`);
            console.log('------------------------');
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debugRates();
