const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const HotelStay = require('./models/HotelStay');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;

const seedHotels = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Find all approved guides
        const guides = await User.find({ role: 'guide', isApproved: true });
        if (guides.length === 0) {
            console.log('No guides found! Please create guides first.');
            process.exit(1);
        }

        console.log(`Found ${guides.length} guides: ${guides.map(g => g.name).join(', ')}`);

        // Distribute hotels across available guides
        const hotels = [
            {
                hotelName: 'Hotel Capitol Hill',
                location: 'Ranchi, Jharkhand',
                pricePerNight: 2500,
                roomType: 'Deluxe',
                amenities: ['WiFi', 'AC', 'Breakfast', 'Room Service', 'Parking'],
                maxGuests: 3,
                description: 'Premium hotel in the heart of Ranchi with stunning views of Capitol Hill. Modern amenities with traditional Jharkhand hospitality.',
                guide: guides[0]._id
            },
            {
                hotelName: 'Deoghar Heritage Inn',
                location: 'Deoghar, Jharkhand',
                pricePerNight: 1800,
                roomType: 'Double',
                amenities: ['WiFi', 'AC', 'Temple View', 'Breakfast', 'Hot Water'],
                maxGuests: 2,
                description: 'Located near Baidyanath Dham temple. Perfect stay for pilgrims and heritage lovers visiting Deoghar.',
                guide: guides[0]._id
            },
            {
                hotelName: 'Netarhat Forest Lodge',
                location: 'Netarhat, Jharkhand',
                pricePerNight: 3200,
                roomType: 'Suite',
                amenities: ['Mountain View', 'Fireplace', 'Breakfast', 'Bonfire', 'Nature Trail'],
                maxGuests: 4,
                description: 'Hilltop retreat in the "Queen of Chotanagpur". Wake up to breathtaking sunrise views over the valley.',
                guide: guides[Math.min(1, guides.length - 1)]._id
            },
            {
                hotelName: 'Jamshedpur City Stay',
                location: 'Jamshedpur, Jharkhand',
                pricePerNight: 2000,
                roomType: 'Double',
                amenities: ['WiFi', 'AC', 'Gym', 'Restaurant', 'Laundry'],
                maxGuests: 2,
                description: 'Modern city hotel near Jubilee Park and Dimna Lake. Ideal for both business and leisure travelers.',
                guide: guides[Math.min(1, guides.length - 1)]._id
            },
            {
                hotelName: 'Betla Jungle Resort',
                location: 'Betla, Palamau, Jharkhand',
                pricePerNight: 2800,
                roomType: 'Deluxe',
                amenities: ['Safari Booking', 'Restaurant', 'Garden', 'Bird Watching', 'Bonfire'],
                maxGuests: 3,
                description: 'Eco-resort at the edge of Betla National Park. Experience wildlife safaris and jungle treks.',
                guide: guides[Math.min(2, guides.length - 1)]._id
            },
            {
                hotelName: 'Hundru Falls Cottage',
                location: 'Hundru, Ranchi, Jharkhand',
                pricePerNight: 1500,
                roomType: 'Single',
                amenities: ['Waterfall View', 'Breakfast', 'Trekking Guide', 'Hot Water'],
                maxGuests: 2,
                description: 'Cozy cottage near the magnificent Hundru Falls. Perfect weekend getaway from Ranchi city.',
                guide: guides[Math.min(2, guides.length - 1)]._id
            },
            {
                hotelName: 'Hazaribagh Lake View',
                location: 'Hazaribagh, Jharkhand',
                pricePerNight: 1600,
                roomType: 'Double',
                amenities: ['Lake View', 'WiFi', 'AC', 'Breakfast', 'Parking'],
                maxGuests: 2,
                description: 'Serene lakeside hotel in Hazaribagh with views of the lake and surrounding hills. Close to Hazaribagh National Park.',
                guide: guides[0]._id
            },
            {
                hotelName: 'McCluskieganj Colonial Bungalow',
                location: 'McCluskieganj, Jharkhand',
                pricePerNight: 3500,
                roomType: 'Suite',
                amenities: ['Heritage Architecture', 'Garden', 'Library', 'Breakfast', 'Evening Tea'],
                maxGuests: 4,
                description: 'Restored colonial-era bungalow offering a unique heritage experience. Step back in time in this Anglo-Indian settlement.',
                guide: guides[Math.min(1, guides.length - 1)]._id
            }
        ];

        // Remove existing seeded hotels (optional - avoids duplicates)
        const existingCount = await HotelStay.countDocuments();
        console.log(`Existing hotels in DB: ${existingCount}`);

        const result = await HotelStay.insertMany(hotels);
        console.log(`\n✅ Successfully added ${result.length} hotels!\n`);

        result.forEach((h, i) => {
            const guideName = guides.find(g => g._id.toString() === h.guide.toString())?.name || 'Unknown';
            console.log(`  ${i + 1}. 🏨 ${h.hotelName} (${h.location}) — ₹${h.pricePerNight}/night — Guide: ${guideName}`);
        });

        console.log('\nDone!');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

seedHotels();
