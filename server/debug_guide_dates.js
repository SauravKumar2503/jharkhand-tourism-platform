const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkBlockedDates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const guides = await User.find({ role: 'guide' });
        console.log(`Found ${guides.length} guides.`);

        guides.forEach(guide => {
            console.log(`\nGuide: ${guide.name} (${guide.email}) ID: ${guide._id}`);
            if (guide.guideProfile && guide.guideProfile.blockedDates) {
                console.log('Blocked Dates:', guide.guideProfile.blockedDates);
            } else {
                console.log('No blocked dates found or guideProfile missing.');
            }
        });

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkBlockedDates();
