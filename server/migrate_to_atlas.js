const mongoose = require('mongoose');
const User = require('./models/User');
const TourPackage = require('./models/TourPackage');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const HeritageSite = require('./models/HeritageSite');
const Transport = require('./models/Transport');
const Product = require('./models/MarketplaceItem');
const Order = require('./models/MarketplaceOrder');
const HotelStay = require('./models/HotelStay');
const Chat = require('./models/Chat');

const LOCAL_URI = 'mongodb://localhost:27017/jharkhand_tourism';
const ATLAS_URI = 'mongodb+srv://sourav2002kumar:25Sau%402003@cluster0.jijh4wu.mongodb.net/jharkhand_tourism?retryWrites=true&w=majority';

async function migrate() {
    console.log('--- Starting MongoDB Migration ---');
    try {
        // Connect to local DB and fetch everything
        console.log('1. Connecting to Local Database...');
        await mongoose.connect(LOCAL_URI);
        
        console.log('Fetching all local data...');
        const users = await User.find().lean();
        const packages = await TourPackage.find().lean();
        const bookings = await Booking.find().lean();
        const reviews = await Review.find().lean();
        const sites = await HeritageSite.find().lean();
        const transports = await Transport.find().lean();
        const products = await Product.find().lean();
        const orders = await Order.find().lean();
        const hotels = await HotelStay.find().lean();
        const chats = await Chat.find().lean();
        
        console.log(`Successfully fetched: ${users.length} Users, ${packages.length} Packages, ${bookings.length} Bookings, ${products.length} Products, etc.`);
        await mongoose.disconnect();

        // Connect to Atlas and insert everything
        console.log('\n2. Connecting to MongoDB Atlas...');
        await mongoose.connect(ATLAS_URI);

        console.log('Clearing existing data in Atlas to prevent duplicates...');
        await Promise.all([
            User.deleteMany(), TourPackage.deleteMany(), Booking.deleteMany(),
            Review.deleteMany(), HeritageSite.deleteMany(), Transport.deleteMany(),
            Product.deleteMany(), Order.deleteMany(), HotelStay.deleteMany(), Chat.deleteMany()
        ]);

        console.log('Uploading data to Atlas...');
        if(users.length) await User.insertMany(users);
        if(packages.length) await TourPackage.insertMany(packages);
        if(bookings.length) await Booking.insertMany(bookings);
        if(reviews.length) await Review.insertMany(reviews);
        if(sites.length) await HeritageSite.insertMany(sites);
        if(transports.length) await Transport.insertMany(transports);
        if(products.length) await Product.insertMany(products);
        if(orders.length) await Order.insertMany(orders);
        if(hotels.length) await HotelStay.insertMany(hotels);
        if(chats.length) await Chat.insertMany(chats);

        console.log('\n✅ MIGRATION COMPLETE! All your local data is now live on Atlas.');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
