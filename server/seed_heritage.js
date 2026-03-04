require('dotenv').config();
const mongoose = require('mongoose');
const HeritageSite = require('./models/HeritageSite');

const heritageSites = [
    {
        name: "Sun Temple, Ranchi",
        description: "The Sun Temple in Ranchi is a stunning architectural marvel located on a hilltop. Built in the form of a chariot with 18 wheels drawn by seven horses, it is a spiritual oasis featuring a sacred pond.",
        location: "Ranchi, Jharkhand",
        images: ["/vr-thumbs/sun-temple.jpg"],
        vrLink: "/vr/1"
    },
    {
        name: "Hundru Falls",
        description: "Hundru Falls is one of the highest waterfalls in the state, falling from a height of 320 feet. Created by the Subarnarekha River, it offers a spectacular view especially during monsoons.",
        location: "Ranchi District, Jharkhand",
        images: ["/vr-thumbs/hundru-falls.jpg"],
        vrLink: "/vr/2"
    },
    {
        name: "Jagannath Temple",
        description: "A historic temple built in 1691 by King Ani Nath Shahdeo on a hillock. It is a replica of the famous Puri Jagannath Temple and hosts a massive Rath Yatra every year.",
        location: "Ranchi, Jharkhand",
        images: ["/vr-thumbs/jagannath-temple.jpg"],
        vrLink: "/vr/3"
    },
    {
        name: "Dassam Falls",
        description: "Dassam Falls is a spectacular 144-feet waterfall on the Kanchi River. The name means ten streams in the local language, as the river splits into multiple streams before cascading down.",
        location: "Ranchi District, Jharkhand",
        images: ["/vr-thumbs/dassam-falls.png"],
        vrLink: "/vr/4"
    },
    {
        name: "Baidyanath Temple, Deoghar",
        description: "Baidyanath Jyotirlinga is one of the twelve sacred Jyotirlingas of Lord Shiva. The temple complex houses 22 temples and attracts millions of devotees during the annual Shravani Mela.",
        location: "Deoghar, Jharkhand",
        images: ["/vr-thumbs/baidyanath-temple.png"],
        vrLink: "/vr/5"
    },
    {
        name: "Betla National Park",
        description: "Betla National Park is one of the first national parks in India to become a tiger reserve. Spread over 1,135 sq km, it features dense sal forests, elephants, tigers, and the historic Betla Fort ruins.",
        location: "Latehar District, Jharkhand",
        images: ["/vr-thumbs/betla-park.png"],
        vrLink: "/vr/6"
    },
    {
        name: "Jonha Falls (Gautamdhara)",
        description: "Jonha Falls is a stunning 141-feet waterfall surrounded by lush greenery. At its base lies an ancient Buddhist shrine and a statue of Lord Buddha, blending natural beauty with spiritual significance.",
        location: "Ranchi District, Jharkhand",
        images: ["/vr-thumbs/jonha-falls.png"],
        vrLink: "/vr/7"
    },
    {
        name: "Netarhat (Queen of Chotanagpur)",
        description: "Netarhat is a pristine hill station at 3,700 feet altitude, known as 'Queen of Chotanagpur'. Famous for its breathtaking sunrise and sunset points with panoramic views of misty valleys.",
        location: "Latehar District, Jharkhand",
        images: ["/vr-thumbs/netarhat.png"],
        vrLink: "/vr/8"
    },
    {
        name: "Parasnath Hill (Shikharji)",
        description: "Parasnath Hill is the highest peak in Jharkhand at 4,477 feet and the most sacred Jain pilgrimage site. It has 20 Jain tonks where 20 of 24 Tirthankaras attained moksha.",
        location: "Giridih District, Jharkhand",
        images: ["/vr-thumbs/parasnath-hill.png"],
        vrLink: "/vr/9"
    },
    {
        name: "McCluskieganj",
        description: "McCluskieganj is a unique Anglo-Indian settlement founded in 1933, called 'mini England' of India. Features charming colonial bungalows, churches, and old-world atmosphere amidst sal forests.",
        location: "Ranchi District, Jharkhand",
        images: ["/vr-thumbs/mccluskieganj.png"],
        vrLink: "/vr/10"
    },
    {
        name: "Rajrappa Temple",
        description: "Rajrappa is a revered Shakti Pith located at the confluence of Damodar and Bhairavi rivers. The Chhinnamasta Temple here is one of the most important Tantric sites in India.",
        location: "Ramgarh District, Jharkhand",
        images: ["/vr-thumbs/rajrappa-temple.png"],
        vrLink: "/vr/11"
    },
    {
        name: "Dalma Wildlife Sanctuary",
        description: "Dalma Wildlife Sanctuary, spread over 193 sq km, is famous for its elephant herds. The sanctuary sits atop Dalma Hills offering panoramic views of Jamshedpur.",
        location: "East Singhbhum, Jharkhand",
        images: ["/vr-thumbs/dalma-wildlife.png"],
        vrLink: "/vr/12"
    },
    {
        name: "Patratu Valley",
        description: "Patratu Valley is a breathtaking destination known for its serpentine ghat roads winding through lush green hills. The scenic Patratu Dam and reservoir add to the valley's charm.",
        location: "Ramgarh District, Jharkhand",
        images: ["/vr-thumbs/patratu-valley.png"],
        vrLink: "/vr/13"
    },
    {
        name: "Tagore Hill",
        description: "Tagore Hill (Morabadi Hill) is a historic hilltop where Nobel laureate Rabindranath Tagore's elder brother Jyotirindranath Tagore resided. The hill offers panoramic views of Ranchi city.",
        location: "Ranchi, Jharkhand",
        images: ["/vr-thumbs/tagore-hill.png"],
        vrLink: "/vr/14"
    },
    {
        name: "Maithon Dam",
        description: "Maithon Dam is a massive gravity dam on the Barakar River, creating a scenic reservoir surrounded by green hills. India's first underground hydroelectric power station is located inside this dam.",
        location: "Dhanbad District, Jharkhand",
        images: ["/vr-thumbs/maithon-dam.png"],
        vrLink: "/vr/15"
    },
    {
        name: "Saranda Forest",
        description: "Saranda Forest is Asia's largest dense sal forest, spanning over 820 sq km. The name means '700 hills' in the Ho tribal language. Home to rare wildlife including elephants and leopards.",
        location: "West Singhbhum, Jharkhand",
        images: ["/vr-thumbs/betla-park.png"],
        vrLink: "/vr/16"
    },
    {
        name: "Trikut Hill",
        description: "Trikut Hill is a three-peaked hill near Deoghar offering stunning panoramic views. A ropeway connects the base to the summit where ancient Hindu and Jain temples stand.",
        location: "Deoghar District, Jharkhand",
        images: ["/vr-thumbs/parasnath-hill.png"],
        vrLink: "/vr/17"
    },
    {
        name: "Hazaribagh National Park",
        description: "Hazaribagh National Park covers 184 sq km with dense tropical deciduous forests. Home to tigers, leopards, sloth bears, sambhar deer, and numerous bird species.",
        location: "Hazaribagh District, Jharkhand",
        images: ["/vr-thumbs/dalma-wildlife.png"],
        vrLink: "/vr/18"
    },
    {
        name: "Panchghagh Falls",
        description: "Panchghagh Falls is a magnificent waterfall where five separate streams of water cascade down from a height of 70 feet. Surrounded by dense forests and rocky terrain.",
        location: "Khunti District, Jharkhand",
        images: ["/vr-thumbs/dassam-falls.png"],
        vrLink: "/vr/19"
    },
    {
        name: "Massanjore Dam",
        description: "Massanjore Dam (Canada Dam) is a 47-meter tall gravity dam on the Mayurakshi River. Built with Canadian assistance, it creates a vast reservoir ideal for boating.",
        location: "Dumka District, Jharkhand",
        images: ["/vr-thumbs/maithon-dam.png"],
        vrLink: "/vr/20"
    },
    {
        name: "Jubilee Park, Jamshedpur",
        description: "Jubilee Park is a sprawling 238-acre urban park built by Tata Steel. Features fountains, a zoo, rose garden, and the iconic musical fountain that dazzles visitors every evening.",
        location: "Jamshedpur, Jharkhand",
        images: ["/vr-thumbs/tagore-hill.png"],
        vrLink: "/vr/21"
    },
    {
        name: "Tilaiya Dam",
        description: "Tilaiya Dam was the first dam built under the Damodar Valley Corporation project on the Barakar River. A historic achievement in India's post-independence development.",
        location: "Koderma District, Jharkhand",
        images: ["/vr-thumbs/maithon-dam.png"],
        vrLink: "/vr/22"
    },
    {
        name: "Rajmahal Hills",
        description: "Rajmahal Hills are ancient Jurassic-age basalt hills along the Ganges. Once the capital of Bengal under Mughal rule, the area features Mughal-era ruins and fossil parks.",
        location: "Sahibganj District, Jharkhand",
        images: ["/vr-thumbs/patratu-valley.png"],
        vrLink: "/vr/23"
    },
    {
        name: "Itkhori Temples",
        description: "Itkhori is an ancient archaeological site with Hindu and Buddhist temple ruins dating from the 8th-12th century. The Bhagwati Temple here is a significant Shakti Pith.",
        location: "Chatra District, Jharkhand",
        images: ["/vr-thumbs/baidyanath-temple.png"],
        vrLink: "/vr/24"
    },
    {
        name: "Hirni Falls",
        description: "Hirni Falls is a stunning 121-feet waterfall on the Ramgarha River, surrounded by dense sal forests. The falls create a natural pool at the base ideal for bathing.",
        location: "West Singhbhum, Jharkhand",
        images: ["/vr-thumbs/jonha-falls.png"],
        vrLink: "/vr/25"
    },
    {
        name: "Topchanchi Lake",
        description: "Topchanchi Lake is a serene natural lake nestled in the Parasnath Hills, covering 214 acres. Surrounded by dense forests and rolling hills, a peaceful retreat.",
        location: "Dhanbad District, Jharkhand",
        images: ["/vr-thumbs/patratu-valley.png"],
        vrLink: "/vr/26"
    },
    {
        name: "Dimna Lake",
        description: "Dimna Lake is a scenic artificial reservoir near Jamshedpur, set against the Dalma Hills backdrop. Popular for boating, picnics, and stunning sunset views.",
        location: "East Singhbhum, Jharkhand",
        images: ["/vr-thumbs/maithon-dam.png"],
        vrLink: "/vr/27"
    },
    {
        name: "Nandan Pahar",
        description: "Nandan Pahar is a popular amusement and nature park on a small hill in Deoghar. Features adventure activities, rides, a toy train, and panoramic views of the city.",
        location: "Deoghar, Jharkhand",
        images: ["/vr-thumbs/tagore-hill.png"],
        vrLink: "/vr/28"
    },
    {
        name: "Surajkund Hot Springs",
        description: "Surajkund is a natural hot spring site near Hazaribagh with water temperatures reaching 88°C. The springs have medicinal properties and are surrounded by dense forest.",
        location: "Hazaribagh District, Jharkhand",
        images: ["/vr-thumbs/rajrappa-temple.png"],
        vrLink: "/vr/29"
    },
    {
        name: "Lodh Falls (Budha Ghagh)",
        description: "Lodh Falls is the highest waterfall in Jharkhand, plunging 468 feet from a cliff on the Burha River. Surrounded by pristine forest, it offers a truly awe-inspiring spectacle.",
        location: "Latehar District, Jharkhand",
        images: ["/vr-thumbs/dassam-falls.png"],
        vrLink: "/vr/30"
    }
];

const seedHeritage = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing heritage sites
        await HeritageSite.deleteMany({});
        console.log('🗑️  Cleared existing heritage sites');

        // Insert all 30 sites
        const result = await HeritageSite.insertMany(heritageSites);
        console.log(`🏛️  Successfully seeded ${result.length} heritage sites!`);

        result.forEach((site, i) => {
            console.log(`   ${i + 1}. ${site.name} — ${site.location}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding heritage sites:', err.message);
        process.exit(1);
    }
};

seedHeritage();
