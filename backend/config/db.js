const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connection.host}`);
  } catch (err) {
    console.error(`Database connection failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
