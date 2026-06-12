require('dotenv').config();
const mongoose = require('mongoose');

const checkDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Using connection string:', uri.replace(/:([^@]+)@/, ':****@')); // Mask password
    
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB.');
    
    const db = mongoose.connection.db;
    console.log('Current database name:', mongoose.connection.name);
    
    const collections = await db.listCollections().toArray();
    console.log('Collections in current database:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(` - ${col.name}: ${count} documents`);
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error checking DB:', error.message);
    process.exit(1);
  }
};

checkDB();
