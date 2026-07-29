import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import os from "os";
import path from "path";

let mongod: MongoMemoryServer;

// Runs once before all test files that import this setup.
// Spins up a real (but in-memory, throwaway) MongoDB so integration tests
// hit real Mongoose models/validation instead of mocks.
beforeAll(async () => {
  mongod = await MongoMemoryServer.create({
    instance: {
      launchTimeout: 30000,
    },
    binary: {
      downloadDir: path.join(os.tmpdir(), "mongodb-memory-server"),
    },
  });
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  // Wipe all collections between tests so tests don't leak state into each other.
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});