require('dotenv').config();
const mongoose = require('mongoose');
const Transport = require('./models/Transport');

const transportData = [
    { name: 'Birsa Munda Airport', type: 'airport', city: 'Ranchi', lat: 23.3143, lng: 85.3213, facilities: ['Domestic Terminal', 'Car Rental', 'ATM', 'Food Court'] },
    { name: 'Sonari Airport', type: 'airport', city: 'Jamshedpur', lat: 22.8157, lng: 86.1714, facilities: ['Small Terminal', 'Taxi Stand'] },
    { name: 'Ranchi Junction', type: 'railway', city: 'Ranchi', lat: 23.3441, lng: 85.3096, facilities: ['Waiting Room', 'Food Stalls', 'ATM', 'Cloak Room'] },
    { name: 'Hatia Junction', type: 'railway', city: 'Ranchi', lat: 23.3200, lng: 85.2900, facilities: ['Waiting Room', 'Food Court', 'Book Stall'] },
    { name: 'Tatanagar Junction', type: 'railway', city: 'Jamshedpur', lat: 22.7878, lng: 86.1650, facilities: ['AC Waiting Room', 'Restaurant', 'ATM', 'Lounge'] },
    { name: 'Bokaro Steel City', type: 'railway', city: 'Bokaro', lat: 23.6693, lng: 86.1511, facilities: ['Waiting Room', 'Food Stalls'] },
    { name: 'Dhanbad Junction', type: 'railway', city: 'Dhanbad', lat: 23.7957, lng: 86.4304, facilities: ['AC Waiting Room', 'Restaurant', 'ATM'] },
    { name: 'Jasidih Junction', type: 'railway', city: 'Deoghar', lat: 24.5156, lng: 86.4903, facilities: ['Waiting Room', 'Temple shuttles'] },
    { name: 'Gomo Junction', type: 'railway', city: 'Parasnath', lat: 23.8779, lng: 86.0485, facilities: ['Waiting Room', 'Parasnath Hill access'] },
    { name: 'Khadgarha Bus Stand', type: 'bus', city: 'Ranchi', lat: 23.3594, lng: 85.3375, facilities: ['State Bus Services', 'Private Operators', 'Ticket Counter'] },
    { name: 'Birsa Munda Bus Terminal', type: 'bus', city: 'Ranchi', lat: 23.3500, lng: 85.3300, facilities: ['AC Buses', 'Inter-city Services', 'Night Services'] },
    { name: 'Sakchi Bus Stand', type: 'bus', city: 'Jamshedpur', lat: 22.8046, lng: 86.2029, facilities: ['Local & Inter-city', 'Private Operators'] },
    { name: 'Deoghar Bus Stand', type: 'bus', city: 'Deoghar', lat: 24.4843, lng: 86.6917, facilities: ['Temple Shuttles', 'Inter-city', 'Local Transport'] },
    { name: 'Hazaribagh Bus Stand', type: 'bus', city: 'Hazaribagh', lat: 23.9925, lng: 85.3637, facilities: ['State Transport', 'Private Operators'] },
    { name: 'Giridih Bus Stand', type: 'bus', city: 'Giridih', lat: 24.1842, lng: 86.3008, facilities: ['Local Transport', 'Parasnath Hill Services'] }
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const count = await Transport.countDocuments();
    if (count > 0) {
        console.log(`Transport collection already has ${count} entries. Skipping seed.`);
        process.exit(0);
    }

    await Transport.insertMany(transportData);
    console.log(`Seeded ${transportData.length} transport hubs!`);
    process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
