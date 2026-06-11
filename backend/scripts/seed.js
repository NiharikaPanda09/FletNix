const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Show = require('../models/Show');

const csvFilePath = path.join(__dirname, '..', '..', 'netflix_titles.csv');

const seedData = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    console.log('Clearing existing shows from database...');
    await Show.deleteMany({});
    console.log('Database cleared.');

    const results = [];
    console.log(`Reading CSV file from: ${csvFilePath}...`);

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => {
        // Clean up keys and extract values
        results.push({
          show_id: data.show_id ? data.show_id.trim() : '',
          type: data.type ? data.type.trim() : '',
          title: data.title ? data.title.trim() : '',
          director: data.director ? data.director.trim() : '',
          cast: data.cast ? data.cast.trim() : '',
          country: data.country ? data.country.trim() : '',
          date_added: data.date_added ? data.date_added.trim() : '',
          release_year: data.release_year ? parseInt(data.release_year.trim(), 10) : 0,
          rating: data.rating ? data.rating.trim() : '',
          duration: data.duration ? data.duration.trim() : '',
          listed_in: data.listed_in ? data.listed_in.trim() : '',
          description: data.description ? data.description.trim() : ''
        });
      })
      .on('end', async () => {
        console.log(`Parsed ${results.length} rows. Inserting into MongoDB...`);
        
        // Insert in chunks to avoid memory limit issues with very large datasets
        const chunkSize = 1000;
        for (let i = 0; i < results.length; i += chunkSize) {
          const chunk = results.slice(i, i + chunkSize);
          await Show.insertMany(chunk);
          console.log(`Inserted chunk ${Math.floor(i / chunkSize) + 1} (${chunk.length} items)...`);
        }

        console.log('Data Seeding completed successfully!');
        mongoose.connection.close();
        process.exit(0);
      })
      .on('error', (err) => {
        console.error(`Error reading CSV: ${err.message}`);
        mongoose.connection.close();
        process.exit(1);
      });
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
