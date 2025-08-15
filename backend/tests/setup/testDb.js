import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;

beforeAll(async () => {
  
  if(mongoose.connection.readyState !== 0) 
  {
    await mongoose.disconnect();
  }

  // Creating in-memory MongoDB instance
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  // Connecting to the in-memory database
  await mongoose.connect(uri);

  console.log('Connected to test database');
}, 30000);

afterEach(async () => {
  // Cleaning up after each test
  if(mongoose.connection.readyState === 1) 
   {
    const collections = await mongoose.connection.db.collections();
    
    for(const collection of collections) {
      try {
        await collection.deleteMany({});
      } catch (error) {
        console.warn(`Warning: Could not clean collection ${collection.collectionName}:`, error.message);
      }
    }
  }
});

afterAll(async () => {

  if(mongoose.connection.readyState !== 0) 
  {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  
  if(mongod) 
  {
    await mongod.stop();
  }
  
  console.log('Test database connection closed');
}, 30000);

process.on('unhandledRejection', (err) => {
  console.warn('Unhandled Promise Rejection in tests:', err);
});