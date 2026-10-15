import mongoose from 'mongoose';
import env from './env.js';
import User from '../models/User.js';
import { seedDatabase } from '../seed.js';

let mongodInstance = null;

/**
 * Connect to MongoDB.
 * Attempts connection to the configured MONGO_URI.
 * If connection is refused (e.g. no local MongoDB service running),
 * it seamlessly boots an in-memory MongoDB instance for hassle-free development.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`  Database: Connected → ${conn.connection.host}/${conn.connection.name}`);

    // If database is empty, auto-seed with initial accounts and demo data
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('  Database: Empty database detected, auto-seeding demo data...');
      await seedDatabase(false);
    }
  } catch (error) {
    console.warn(`  Database: Direct connection to ${env.MONGO_URI} not available (${error.message}).`);
    console.log('  Database: Starting local in-memory MongoDB for seamless development...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'gst-billing',
        },
      });
      const uri = mongodInstance.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`  Database: In-Memory MongoDB Connected → ${uri}`);
      console.log('  Database: Seeding demo data (Shop, Users, Items, Parties, Invoices)...');
      await seedDatabase(false);
      console.log('  Database: Ready for active development & testing!');
    } catch (memErr) {
      console.error(`  Database: Failed to initialize in-memory MongoDB → ${memErr.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;

