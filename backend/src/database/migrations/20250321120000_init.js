/**
 * Initial migration: create indexes for all collections.
 * @param {import('mongodb').Db} db
 * @param {import('mongodb').MongoClient} client
 */
export const up = async (db, client) => {
  // Master database indexes
  const masterDb = db.client.db('master');
  await masterDb.collection('tenants').createIndex({ domain: 1 }, { unique: true, sparse: true });
  await masterDb.collection('tenants').createIndex({ dbName: 1 }, { unique: true });
  await masterDb.collection('masterusers').createIndex({ email: 1 }, { unique: true });

  // Tenant database indexes – run for each tenant? This is tricky.
  // Instead, we can rely on Mongoose schema indexes with autoIndex in development.
  // For production, we create indexes via Mongoose or run per-tenant migration.
  console.log('Initial migration complete');
};

export const down = async (db, client) => {
  const masterDb = db.client.db('master');
  await masterDb.collection('tenants').dropIndex('domain_1');
  await masterDb.collection('tenants').dropIndex('dbName_1');
  await masterDb.collection('masterusers').dropIndex('email_1');
  console.log('Rollback complete');
};