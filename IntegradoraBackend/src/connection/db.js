const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('Mongo URI: [HIDDEN FOR SECURITY]');

    const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.CONNECTION_STRING);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
