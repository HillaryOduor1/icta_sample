// backend/scripts/register-icta-tenant.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MASTER_DB_NAME = 'master';
const TENANT_DB_NAME = 'icta_sample';

async function registerTenant() {
  let masterConn = null;
  
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined in .env');
    }

    // Connect to master database
    masterConn = await mongoose.createConnection(mongoUri, {
      dbName: MASTER_DB_NAME
    });
    
    console.log('✅ Connected to master database');

    // Define Tenant schema matching your existing structure
    const tenantSchema = new mongoose.Schema({
      name: { type: String, required: true },
      dbName: { type: String, required: true, unique: true },
      siteId: { type: String, required: true, unique: true },
      domain: { type: String, unique: true, sparse: true },
      contactEmail: { type: String },
      active: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    const Tenant = masterConn.model('Tenant', tenantSchema);

    // List existing tenants
    const existingTenants = await Tenant.find({});
    console.log('\n📊 Existing tenants:');
    existingTenants.forEach(t => {
      console.log(`   - ${t.name}: dbName=${t.dbName}, domain=${t.domain || 'N/A'}, siteId=${t.siteId}`);
    });

    // Check if tenant with this dbName already exists
    let existingTenant = await Tenant.findOne({ dbName: TENANT_DB_NAME });

    if (existingTenant) {
      console.log(`\n⚠️ Tenant with dbName '${TENANT_DB_NAME}' already exists.`);
      console.log('✅ Tenant already registered - no action needed');
      console.log(`   Name: ${existingTenant.name}`);
      console.log(`   DB Name: ${existingTenant.dbName}`);
      console.log(`   Site ID: ${existingTenant.siteId}`);
    } else {
      // Check if domain is available, if not use a unique one
      let domain = 'icta.localhost';
      let domainExists = await Tenant.findOne({ domain });
      
      if (domainExists) {
        domain = `icta-${Date.now()}.localhost`;
        console.log(`\n⚠️ Domain 'icta.localhost' already in use, using: ${domain}`);
      }
      
      // Generate unique siteId
      const siteId = `icta-${uuidv4().substring(0, 8)}`;
      
      // Create new tenant
      const newTenant = await Tenant.create({
        name: 'ICT Authority',
        dbName: TENANT_DB_NAME,
        siteId: siteId,
        domain: domain,
        contactEmail: 'info@ict.go.ke',
        active: true
      });
      
      console.log('\n✅ New tenant created successfully:');
      console.log(`   ID: ${newTenant._id}`);
      console.log(`   Name: ${newTenant.name}`);
      console.log(`   DB Name: ${newTenant.dbName}`);
      console.log(`   Site ID: ${newTenant.siteId}`);
      console.log(`   Domain: ${newTenant.domain}`);
    }

    // List all tenants after operation
    const allTenants = await Tenant.find({});
    console.log('\n📊 All tenants in master database:');
    allTenants.forEach(t => {
      console.log(`   - ${t.name}: dbName=${t.dbName}, domain=${t.domain || 'N/A'}, active=${t.active}`);
    });

    console.log('\n🎉 Tenant registration completed!');
    
  } catch (error) {
    console.error('❌ Registration failed:', error);
    if (error.code === 11000) {
      console.error('\n💡 Hint: Duplicate key error. A tenant with this dbName, siteId, or domain already exists.');
      console.error('   Use a different dbName, siteId, or domain.');
    }
  } finally {
    if (masterConn) {
      await masterConn.close();
    }
  }
}

registerTenant();