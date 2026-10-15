import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Shop from '../models/Shop.js';
import Item from '../models/Item.js';
import { generate5000Products } from '../data/products5000Catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gst-billing';

async function run() {
  console.log('Connecting to MongoDB...');
  let mongod = null;
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
  } catch {
    console.log('Direct Mongo connection failed, starting in-memory server...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongod = await MongoMemoryServer.create({ instance: { dbName: 'gst-billing' } });
    await mongoose.connect(mongod.getUri());
  }

  // Find Aayush Mobile and Computer
  let shop = await Shop.findOne({ businessName: /Aayush Mobile/i });
  if (!shop) {
    shop = await Shop.findOne({});
  }

  if (!shop) {
    console.error('No shop found. Please seed the database first.');
    process.exit(1);
  }

  console.log(`Target Shop: ${shop.businessName} (ID: ${shop._id})`);
  const products = generate5000Products();
  console.log(`Generated ${products.length} products. Filtering duplicates...`);

  const existing = await Item.find({ shopId: shop._id }, 'name');
  const existingNames = new Set(existing.map((i) => i.name.toLowerCase().trim()));

  const toInsert = products
    .filter((p) => p.name && !existingNames.has(p.name.toLowerCase().trim()))
    .map((p) => ({
      shopId: shop._id,
      name: p.name.trim(),
      hsnCode: p.hsnCode || '84713010',
      price: Math.max(1, p.price),
      gstPercent: p.gstPercent || 18,
      description: p.description || '',
    }));

  console.log(`Inserting ${toInsert.length} new items in batches of 1000...`);
  const batchSize = 1000;
  for (let i = 0; i < toInsert.length; i += batchSize) {
    const chunk = toInsert.slice(i, i + batchSize);
    await Item.insertMany(chunk, { ordered: false });
    console.log(`Inserted chunk ${i + 1} to ${Math.min(i + batchSize, toInsert.length)}`);
  }

  const finalCount = await Item.countDocuments({ shopId: shop._id });
  console.log(`🎉 5000+ Products Import Complete! Total Catalog Items in Database: ${finalCount}`);

  await mongoose.disconnect();
  if (mongod) await mongod.stop();
  process.exit(0);
}

run().catch((err) => {
  console.error('Error importing 5000 products:', err);
  process.exit(1);
});
