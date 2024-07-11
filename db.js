const mongoose = require('mongoose');

// Connection String
const dbURI = 'mongodb://localhost:27017/mydatabase';

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
