const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const MarketplaceItem = require('./models/MarketplaceItem');

const sampleItems = [
    // Handicrafts
    {
        name: 'Dokra Art - Dancing Couple',
        description: 'Handcrafted tribal Dokra metal art depicting a traditional dancing couple. Made by skilled artisans of the Birhor tribe using the lost-wax casting technique passed down through generations.',
        price: 1200,
        category: 'handicraft',
        images: ['https://images.unsplash.com/photo-1582738412874-45f5bf5d8091?w=500'],
        sellerName: 'Tribal Artisan Collective',
        location: 'Khunti, Jharkhand',
        contact: { phone: '9876543210', email: 'artisans@tribal.com' },
        rating: 4.5,
        reviewCount: 23,
        tags: ['dokra', 'tribal', 'metal art', 'handmade']
    },
    {
        name: 'Paitkar Painting - Village Life',
        description: 'Traditional scroll painting from the Paitkar tribe of Jharkhand, depicting village life and mythological scenes using natural dyes on cloth canvas.',
        price: 800,
        category: 'handicraft',
        images: ['https://images.unsplash.com/photo-1579762715118-a6f1d789a1c0?w=500'],
        sellerName: 'Paitkar Art Studio',
        location: 'Amadubi, Jharkhand',
        contact: { phone: '9123456780', email: 'paitkar@art.com' },
        rating: 4.8,
        reviewCount: 31,
        tags: ['painting', 'tribal', 'paitkar', 'scroll']
    },
    {
        name: 'Bamboo Craft Basket Set',
        description: 'Set of 3 handwoven bamboo baskets made by local tribal women in Ranchi. Eco-friendly and durable, perfect for home décor or gifting.',
        price: 450,
        category: 'handicraft',
        images: ['https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=500'],
        sellerName: 'Green Bamboo Women SHG',
        location: 'Ranchi, Jharkhand',
        contact: { phone: '9988776655', email: 'bamboo@shg.com' },
        rating: 4.2,
        reviewCount: 15,
        tags: ['bamboo', 'eco-friendly', 'basket', 'handwoven']
    },
    // Homestays
    {
        name: 'Forest View Homestay - Netarhat',
        description: 'Wake up to stunning sunrise views at the "Queen of Chotanagpur." This cozy homestay offers 3 rooms with home-cooked tribal cuisine, guided nature walks, and bonfire evenings.',
        price: 1500,
        category: 'homestay',
        images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=500'],
        sellerName: 'Netarhat Stays',
        location: 'Netarhat, Latehar, Jharkhand',
        contact: { phone: '8877665544', email: 'stay@netarhat.com' },
        rating: 4.7,
        reviewCount: 42,
        tags: ['netarhat', 'forest', 'sunrise', 'nature']
    },
    {
        name: 'Tribal Heritage Cottage - McCluskieganj',
        description: 'Experience Anglo-Indian heritage in a restored colonial cottage. Includes breakfast, cycling tours, and access to the community library.',
        price: 2200,
        category: 'homestay',
        images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=500'],
        sellerName: 'Heritage Homes Jharkhand',
        location: 'McCluskieganj, Jharkhand',
        contact: { phone: '7766554433', email: 'heritage@stay.com' },
        rating: 4.6,
        reviewCount: 28,
        tags: ['heritage', 'colonial', 'cottage', 'mcluskieganj']
    },
    {
        name: 'Riverside Eco Lodge - Patratu',
        description: 'Eco-friendly lodge overlooking the breathtaking Patratu Valley. Solar-powered rooms, organic meals, and kayaking available.',
        price: 1800,
        category: 'homestay',
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500'],
        sellerName: 'Patratu Eco Stays',
        location: 'Patratu, Ramgarh, Jharkhand',
        contact: { phone: '6655443322', email: 'eco@patratu.com' },
        rating: 4.4,
        reviewCount: 19,
        tags: ['patratu', 'valley', 'eco', 'kayaking']
    },
    // Events
    {
        name: 'Sarhul Festival Celebration',
        description: 'Join the vibrant Sarhul spring festival! Experience traditional tribal dance, music, and sacred Sal tree worship. Includes traditional feast and cultural immersion.',
        price: 500,
        category: 'event',
        images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500'],
        sellerName: 'Jharkhand Cultural Society',
        location: 'Ranchi, Jharkhand',
        contact: { phone: '5544332211', email: 'events@jcs.com' },
        rating: 4.9,
        reviewCount: 67,
        tags: ['sarhul', 'festival', 'tribal', 'dance', 'spring']
    },
    {
        name: 'Tribal Food Walk - Jamshedpur',
        description: 'A guided walking tour through local tribal food stalls. Taste authentic Handia, Dhuska, Rugra, Litti-Chokha, and more. 3-hour experience with a local food historian.',
        price: 350,
        category: 'event',
        images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500'],
        sellerName: 'Taste of Jharkhand',
        location: 'Jamshedpur, Jharkhand',
        contact: { phone: '4433221100', email: 'food@taste.com' },
        rating: 4.6,
        reviewCount: 34,
        tags: ['food', 'tribal', 'walking tour', 'cuisine']
    },
    // Ecotourism
    {
        name: 'Betla Tiger Safari Experience',
        description: 'Full-day guided safari through Betla National Park. Spot tigers, elephants, and rare bird species. Includes jeep ride, lunch, and expert naturalist guide.',
        price: 2500,
        category: 'ecotourism',
        images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500'],
        sellerName: 'Betla Wildlife Tours',
        location: 'Betla, Latehar, Jharkhand',
        contact: { phone: '3322110099', email: 'safari@betla.com' },
        rating: 4.8,
        reviewCount: 56,
        tags: ['betla', 'safari', 'tiger', 'wildlife', 'national park']
    },
    {
        name: 'Dalma Hills Trek & Wildlife',
        description: 'Weekend trek through the Dalma Wildlife Sanctuary. Spot wild elephants, deer, and exotic birds. Camp under the stars with bonfire dinner.',
        price: 1800,
        category: 'ecotourism',
        images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=500'],
        sellerName: 'Trek Jharkhand',
        location: 'Dalma, Jamshedpur, Jharkhand',
        contact: { phone: '2211009988', email: 'trek@dalma.com' },
        rating: 4.5,
        reviewCount: 38,
        tags: ['dalma', 'trek', 'elephant', 'camping', 'wildlife']
    },
    {
        name: 'Waterfall Trail - Hundru to Jonha',
        description: 'A scenic half-day trail covering two of Jharkhand\'s most magnificent waterfalls. Includes transport, guide, and packed lunch.',
        price: 900,
        category: 'ecotourism',
        images: ['https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=500'],
        sellerName: 'Jharkhand Trails',
        location: 'Ranchi District, Jharkhand',
        contact: { phone: '1100998877', email: 'trails@jh.com' },
        rating: 4.3,
        reviewCount: 21,
        tags: ['waterfall', 'hundru', 'jonha', 'trail', 'hiking']
    },
    {
        name: 'Lac Bangle Making Workshop',
        description: 'Learn the traditional art of lac bangle making from master craftswomen. 2-hour hands-on workshop. Take home your own set of handcrafted bangles.',
        price: 300,
        category: 'handicraft',
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500'],
        sellerName: 'Lac Artisans Cooperative',
        location: 'Deoghar, Jharkhand',
        contact: { phone: '9900887766', email: 'lac@artisans.com' },
        rating: 4.7,
        reviewCount: 45,
        tags: ['lac', 'bangle', 'workshop', 'handcraft', 'deoghar']
    }
];

const seedMarketplace = async () => {
    try {
        await connectDB();
        await MarketplaceItem.deleteMany({});
        console.log('Cleared existing marketplace items');

        await MarketplaceItem.insertMany(sampleItems);
        console.log(`Seeded ${sampleItems.length} marketplace items successfully!`);

        process.exit(0);
    } catch (err) {
        console.error('Error seeding marketplace:', err);
        process.exit(1);
    }
};

seedMarketplace();
