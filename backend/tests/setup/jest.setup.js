import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-testing';

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const c of collections) await c.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});