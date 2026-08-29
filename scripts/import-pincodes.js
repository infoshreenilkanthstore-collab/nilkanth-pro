const axios = require('axios');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Define Schema here to avoid dependency issues in standalone script
const PincodeSchema = new mongoose.Schema({
  officename: String,
  pincode: String,
  officeType: String,
  Deliverystatus: String,
  divisionname: String,
  regionname: String,
  circlename: String,
  Taluk: String,
  Districtname: String,
  statename: String
}, { timestamps: true });

const Pincode = mongoose.models.Pincode || mongoose.model('Pincode', PincodeSchema);

async function importData() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env.local');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const csvUrl = 'http://data.gov.in/sites/default/files/all_india_pin_code.csv';
    const filePath = path.join(__dirname, 'india_pincode.csv');

    console.log('Downloading CSV from:', csvUrl);
    const response = await axios({
      method: 'get',
      url: csvUrl,
      responseType: 'stream'
    });

    console.log('Parsing and importing data...');
    const results = [];
    let count = 0;
    const batchSize = 1000;

    response.data
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
        if (results.length >= batchSize) {
          const batch = [...results];
          results.length = 0;
          Pincode.insertMany(batch)
            .then(() => {
              count += batch.length;
              process.stdout.write(`\rImported ${count} records...`);
            })
            .catch(err => console.error('\nBatch insert error:', err));
        }
      })
      .on('end', async () => {
        if (results.length > 0) {
          await Pincode.insertMany(results);
          count += results.length;
        }
        console.log(`\nImport completed! Total records: ${count}`);
        await mongoose.disconnect();
        process.exit(0);
      })
      .on('error', (err) => {
        console.error('Stream error:', err);
        process.exit(1);
      });

  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

importData();
