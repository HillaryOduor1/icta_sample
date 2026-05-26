require('dotenv').config();
const mongoose = require('mongoose');
const MasterUser = require('../models/MasterUser');

const BASE_URI = process.env.MONGODB_URI;
if (!BASE_URI) throw new Error('MONGODB_URI missing');

const buildDatabaseURI = (baseURI, dbName) => {
  const [base, query] = baseURI.split('?');
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${dbName}${query ? `?${query}` : ''}`;
};

const masterURI = buildDatabaseURI(BASE_URI, 'master');

const seedMaster = async () => {
  try {
    await mongoose.connect(masterURI);
    console.log('Connected to master DB');

    const masterEmail = process.env.MASTER_EMAILS?.split(',')[0] || 'admin@example.com';
    const existing = await MasterUser.findOne({ email: masterEmail });
    if (existing) {
      console.log(`Master user already exists: ${masterEmail}`);
      process.exit(0);
    }

    // Create master user – Google OAuth will link by email on first login
    // We only need the email; name and googleId will be added during OAuth.
    await MasterUser.create({
      email: masterEmail,
      name: 'Super Admin',
      role: 'superadmin'
    });
    console.log(`Master user created with email ${masterEmail}. They can now log in via Google OAuth.`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedMaster();