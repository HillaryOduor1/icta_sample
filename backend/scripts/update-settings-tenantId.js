import mongoose from 'mongoose';
import { config } from '../src/config/env.js';

const tenantDbName = config.defaultTenantDbName; // should be 'landscapes_integrity_solutions'
const uri = config.mongodbUri.split('?')[0] + tenantDbName + '?' + config.mongodbUri.split('?')[1];

console.log(`Connecting to ${tenantDbName}...`);

const run = async () => {
  const conn = await mongoose.createConnection(uri);
  const settingsCollection = conn.collection('settings');
  const result = await settingsCollection.updateMany(
    { tenantId: { $exists: false } },
    { $set: { tenantId: tenantDbName } }
  );
  console.log(`Updated ${result.modifiedCount} settings documents`);
  await conn.close();
};

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});