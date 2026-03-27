const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // URL encoding the @ in the password to %40 prevent connection string parsing errors
        const uri = process.env.MONGO_URI || 'mongodb+srv://sourav2002kumar:25Sau%402003@cluster0.jijh4wu.mongodb.net/jharkhand_tourism?retryWrites=true&w=majority';
        const conn = await mongoose.connect(uri);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
