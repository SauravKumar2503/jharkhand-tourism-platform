require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function migrate() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Approve all existing guides
    const result1 = await User.updateMany(
        { role: 'guide' },
        { $set: { isApproved: true } }
    );
    console.log('Set', result1.modifiedCount, 'existing guides to approved');

    // Approve all other users
    const result2 = await User.updateMany(
        { role: { $ne: 'guide' } },
        { $set: { isApproved: true } }
    );
    console.log('Set', result2.modifiedCount, 'other users to approved');

    console.log('Migration complete!');
    process.exit(0);
}

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});
