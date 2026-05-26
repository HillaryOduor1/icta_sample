/*const mongoose = require('mongoose');
const User = require('../models/User');
const Settings = require('../models/Settings');
const SiteContent = require('../models/Content');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user if not exists
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        active: true
      });
      console.log('Admin user created');
    }

    // Create default settings if not exists
    const settingsExists = await Settings.findOne();
    if (!settingsExists) {
      await Settings.create({});
      console.log('Default settings created');
    }

    // Create default content if not exists
    const contentExists = await SiteContent.findOne();
    if (!contentExists) {
      await SiteContent.create({
        page: 'home',
        navigation: [
          { name: 'Home', href: '/' },
          { name: 'Research', href: '/research' },
          { name: 'Areas', href: '/#areas' },
          { name: 'About', href: '/#about' },
          { name: 'Partners', href: '/#partners' }
        ],
        hero: {
          announcementBadge: '🚀 New',
          announcementText: 'Version 2.0 just launched',
          headline: 'Build modern websites',
          highlightedText: 'faster than ever',
          subtext: 'A fully customizable, production-ready template designed to help you launch SaaS products in record time.',
          primaryButtonText: 'Get Started',
          secondaryButtonText: 'View Demo',
          features: ['No backend required', 'Fully customizable content', 'TypeScript + Tailwind ready']
        },
        about: {
          badge: 'Who We Are',
          title: 'Bridging the Gap Between Research and Governance',
          description1: 'Landscapes Integrity Solutions (LIS) is a dedicated think tank focused on addressing complex policy implementation challenges.',
          description2: 'We bridge the gap between high-level academic research and practical, on-the-ground governance.',
          stats: [{ number: '150+', label: 'Policy Research Papers' }],
          features: [
            { icon: 'verified_user', title: 'Integrity First', description: 'Unbiased, evidence-based advisory.' },
            { icon: 'public', title: 'Global Impact', description: 'Scalable solutions for planet-wide issues.' }
          ]
        }
      });
      console.log('Default content created');
    }

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();*/

/*
const mongoose = require('mongoose');
const User = require('../models/User');
const Settings = require('../models/Settings');
const SiteContent = require('../models/Content');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB

    const mongoURI = process.env.MONGODB_URI;
    console.log('Connecting to:', mongoURI.split('/').pop().split('?')[0]);
    
    // Remove the options object - they're not needed in newer versions
    await mongoose.connect(mongoURI);
    
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', mongoose.connection.name);
    //const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lis_cms';
    //await mongoose.connect(mongoURI);
    //console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - uncomment if you want fresh start)
    // await User.deleteMany({});
    // await Settings.deleteMany({});
    // await SiteContent.deleteMany({});
    // console.log('✓ Cleared existing data');

    // Create admin user if not exists
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        active: true
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✓ Admin user already exists');
    }

    // Create default settings if not exists
    const settingsExists = await Settings.findOne();
    if (!settingsExists) {
      await Settings.create({
        theme: {
          mode: 'light',
          primaryColor: '#db2777',
          secondaryColor: '#ec4899',
          backgroundColor: '#ffffff',
          textColor: '#0f172a',
          borderRadius: 'medium',
          shadows: true,
          animations: true
        },
        typography: {
          fontFamily: 'system',
          fontSize: 'normal',
          lineHeight: 1.5,
          letterSpacing: 'normal',
          bodyWeight: 'normal',
          headingWeight: 'bold',
          headingScale: 'normal',
          textAlign: 'left'
        },
        ui: {
          density: 'comfortable',
          buttonStyle: 'filled',
          animations: 'full'
        },
        site: {
          title: 'LIS - Landscape Integrity Solutions',
          description: 'Advancing Policy for Sustainable Landscapes',
          metaKeywords: 'think tank, environmental policy, sustainability, research, governance'
        }
      });
      console.log('✅ Default settings created');
    } else {
      console.log('✓ Settings already exist');
    }

    // Create default content if not exists
    const contentExists = await SiteContent.findOne({ page: 'home' });
    if (!contentExists) {
      await SiteContent.create({
        page: 'home',
        navigation: [
          { name: 'Home', href: '/' },
          { name: 'Research', href: '/research' },
          { name: 'Areas', href: '/#areas' },
          { name: 'About', href: '/#about' },
          { name: 'Partners', href: '/#partners' },
          { name: 'Contact', href: '/contact' }
        ],
        hero: {
          badge: 'Leading the Path to Sustainability',
          headline: 'Advancing Policy for',
          highlightedText: 'Sustainable',
          headlineEnd: 'Landscapes',
          description: 'Landscapes Integrity Solutions (LIS) is a premier think tank providing research and advisories in environmental, natural resources, land, and climate change policy governance.',
          primaryButtonText: 'Explore Our Research',
          secondaryButtonText: 'Partner With Us',
          backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOCEXQMSbAWWgK9aO_Hnbhz5bK_qu2nLHvjUx0UInr63kpps2cjzOIKWaIhbhWSXF8AEl4JrjkrevcMVJ79bv4tLHHudGxWxhjf3QGYEkfz_77VMFfaw9QReFR6u_AIctGARh9sU3oB-TORsRqtXEjel_2V-h4P0GXOwNE2W48lY_w-Jszg0FB5JnUpgPODN7AdVEK7-KcOFFUl1pftj66zWaHMCT__VeR6UgcGZqWHcK3t83FxeKimG-zzmIc8ap1v4AYdGsv0tA'
        },
        about: {
          badge: 'Who We Are',
          title: 'Bridging the Gap Between Research and Governance',
          description1: 'Landscapes Integrity Solutions (LIS) is a dedicated think tank focused on addressing complex policy implementation challenges. We act as a catalyst for environmental change by providing data-driven insights to those who shape our world.',
          description2: 'We bridge the gap between high-level academic research and practical, on-the-ground governance to ensure environmental integrity across all sectors—from local communities to international bodies.',
          stats: [
            { number: '150+', label: 'Policy Research Papers' }
          ],
          features: [
            { icon: 'verified_user', title: 'Integrity First', description: 'Unbiased, evidence-based advisory.' },
            { icon: 'public', title: 'Global Impact', description: 'Scalable solutions for planet-wide issues.' }
          ],
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2Op6-C_MLwO4CkaO1JDhRrwJ3ktU3yZ4sHTMIWPrCxPtQHtiRQbo12xGzz7SALA3Pg-NZmrOZMxlaiQhcucHM1UMPN6jxTzJ1wJ7BMiyGTsEUrdKJy0B-_8OiBxQ2kgjAETrPMu91s9z5mD_mwVbIUgC8y6tUF6K1UGJ1wN-AFr63BhsKnPCynzKgLGDiz2NlRm_JHMi2MsarMRmTA8Wd58ux9J6fk1M7GwcDvzPAoAIx82pYs-dR4wHWPsa7507wTC5L97pKmVE'
        },
        areas: [
          { 
            icon: 'eco',
            title: 'Environment',
            description: 'Focusing on biodiversity protection, ecosystem restoration, and sustainable management of natural heritage.',
            link: '#'
          },
          { 
            icon: 'forest',
            title: 'Natural Resources',
            description: 'Developing frameworks for sustainable resource extraction, water management, and conservation strategies.',
            link: '#'
          },
          { 
            icon: 'landscape',
            title: 'Land Governance',
            description: 'Addressing land rights, tenure security, and equitable land-use planning for resilient communities.',
            link: '#'
          },
          { 
            icon: 'thunderstorm',
            title: 'Climate Policy',
            description: 'Shaping national and international adaptation strategies and mitigation frameworks to meet net-zero goals.',
            link: '#'
          }
        ],
        partners: {
          badge: 'Collaboration',
          title: 'Our Global Network',
          description: 'We believe that environmental integrity is a collective responsibility. LIS partners with a diverse range of stakeholders to turn policy into practice.',
          categories: [
            'National Governments',
            'International NGOs',
            'Multilateral Organizations',
            'Corporate Entities'
          ],
          logos: [
            { icon: 'account_balance' },
            { icon: 'group_work' },
            { icon: 'public' },
            { icon: 'domain' },
            { icon: 'corporate_fare' },
            { icon: 'foundation' },
            { icon: 'policy' },
            { icon: 'diversity_3' }
          ]
        },
        research: [
          {
            category: 'ENVIRONMENT',
            date: 'FEB 2024',
            title: 'Integrity Standards in Carbon Credit Markets',
            description: 'An analysis of current verification protocols and recommendations for high-integrity forest conservation credits.',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTWQY9py9Zi7epdBmm3FDEF7n8U09Msuao7UQwDB6M3TgKsjx5tjKXkTxKuVtXo8TVxzM1aBe-USXflGKUiqpzYwBBjJ-n5kj1tdOV3pF6Ub3SV8Qkr7H30HFfj6BvMHR30T9VgdO80uoR79P44LtaFzZrx55ewZc5L1vuJKRxYIFQDW1BqRe0S7JGszBYEYx7FM-xGENr3ueUqO0SyLdCsZ7lD7D2eWZsIaEUBR9l9n1nsKcc5lA3HPWIoQbm60FVMSenXzDOGwY',
            isNew: true
          },
          {
            category: 'LAND GOVERNANCE',
            date: 'JAN 2024',
            title: 'Decentralized Land Rights in Sub-Saharan Africa',
            description: 'Examining the impact of community-led governance frameworks on landscape restoration and biodiversity retention.',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfp7K7c3bULCBnWOFoYn10wqnO3VP4DWusLDznhR7J0aM89XqdpQWJcFDhINcxkfVLuomNnp_lwH06d8DYmGipJd0hO7vEc2HtLo9y0-tonushZMZv4nx00fzS8gP_ctngK69yrfdub1QbAT4L9VqrHHLXuF8t1MWZxPsIltgEfz4wUJegjfxUVr9bb-aVRTlJiefmgfWY4UvSMHk-TCyS7TFAxXn_mHGDbzsXkh6NQErHsai1zVrPL8cXnpTIIdCzRjQ9rsn3Iw8',
            isNew: false
          },
          {
            category: 'CLIMATE POLICY',
            date: 'DEC 2023',
            title: 'Biodiversity Governance: 2024 Outlook',
            description: 'Assessing the readiness of national policies to meet the \'30x30\' biodiversity conservation targets set by the GBF.',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlpML-C5nbRmxpsCOTKUN_FtxtIxvl_3DovhdaQx7efnAYkxNlj_xibjA34WHhBqcjsSiGQVWrGD4VV7IDvPK6-BKiGND70hrOzcdv6uSJegUCxYhfxGa1rp5f12pewIUf_TGM51vqwlWJIhbJMWdeYL-z3mjNaWgThyS3Z4QKFs2TS5Js85Ef5bh0OmXcNmVD4nq-iJCyPf_L7PqUEVriXZ-Zka2VJcCPIDGIypat-GnL7uIINdQ-5650Gu0ZjR2eAuLjPH3vqoI',
            isNew: false
          }
        ],
        advisory: [
          {
            icon: 'policy',
            title: 'Policy Implementation Support',
            description: 'Helping regulatory bodies translate international climate commitments into local enforceable policies and field-level protocols.'
          },
          {
            icon: 'account_tree',
            title: 'Governance Frameworks',
            description: 'Designing and auditing resource management structures to ensure transparency, equity, and long-term ecosystem integrity.'
          },
          {
            icon: 'verified',
            title: 'Sustainability Audits',
            description: 'Independent scientific verification of conservation projects, carbon claims, and landscape restoration impacts.'
          },
          {
            icon: 'groups',
            title: 'Stakeholder Engagement',
            description: 'Facilitating multi-party dialogues to align disparate interests around shared environmental and socio-economic goals.'
          }
        ],
        cta: {
          title: "Let's build sustainable partnerships together.",
          description: 'Whether you are a government agency looking for policy advisory or a corporate entity seeking sustainability strategies, we are here to help.',
          primaryButtonText: 'Get in Touch',
          secondaryButtonText: 'Download Brochure'
        },
        contact: {
          sectionTitle: {
            text1: 'Get',
            text2: 'In',
            text3: 'Touch'
          },
          form: {
            nameLabel: 'Your Name',
            namePlaceholder: 'Enter your name',
            emailLabel: 'Your Email',
            emailPlaceholder: 'Enter your email',
            messageLabel: 'Your Message',
            messagePlaceholder: 'Write your message here...',
            submitText: 'Send Message'
          }
        },
        footer: {
          description: 'The premier think tank for landscape integrity and environmental policy governance. Bridging research and action for a sustainable future.',
          quickLinks: [
            { name: 'Our Research', href: '/research' },
            { name: 'Thematic Areas', href: '#areas' },
            { name: 'About LIS', href: '#about' },
            { name: 'Partnerships', href: '#partners' },
            { name: 'Careers', href: '#' }
          ],
          contact: {
            address: '123 Policy Square, Environment District, Nairobi, Kenya',
            email: 'info@lis-thinktank.org',
            phone: '+254 (0) 20 123 4567'
          },
          socialLinks: [
            { icon: 'public', href: '#' },
            { icon: 'mail', href: '#' },
            { icon: 'forum', href: '#' }
          ],
          copyright: '© 2024 Landscapes Integrity Solutions (LIS). All Rights Reserved.',
          legalLinks: [
            { name: 'Privacy Policy', href: '#' },
            { name: 'Terms of Service', href: '#' },
            { name: 'Cookie Policy', href: '#' }
          ]
        }
      });
      console.log('✅ Default content created');
    } else {
      console.log('✓ Content already exists');
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Start your backend: npm run dev');
    console.log('2. Start your frontend: cd ../frontend && npm run dev');
    console.log('3. Login to admin: http://localhost:5000/admin (admin/admin123)');
    
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('✓ Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    
    // Close connection on error
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    
    process.exit(1);
  }
};

seedDatabase();*/


/*const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// IMPORTS
const UserSchema = require('../models/User'); // ✅ schema
const SettingsModel = require('../models/Settings'); // ❗ model
const ContentModel = require('../models/Content');   // ❗ model
const MediaModel = require('../models/Media');       // ❗ model
const ActivityModel = require('../models/ActivityLog'); // ❗ model
const Tenant = require('../models/Tenant');

const seedDatabase = async () => {
  let mainConnection;
  let tenantConnection;

  try {
    const BASE_URI = process.env.MONGODB_URI;

    if (!BASE_URI) {
      throw new Error("❌ MONGODB_URI not found in .env");
    }

    /* =====================================================
       1. CONNECT TO MAIN DATABASE
    ===================================================== /

    console.log('🔌 Connecting to MAIN DB...');
    mainConnection = await mongoose.createConnection(BASE_URI);
    console.log('✅ Connected to MAIN DB');

    const TenantModel = mainConnection.model('Tenant', Tenant.schema);

    /* =====================================================
       2. CREATE / ENSURE TENANT
    ===================================================== /

    let tenant = await TenantModel.findOne({ domain: 'localhost' });

    if (!tenant) {
      tenant = await TenantModel.create({
        name: 'Landscapes Integrity Solutions',
        domain: 'localhost',
        siteId: uuidv4(),
        dbName: 'Landscapes_Integrity_Solutions',
        active: true
      });

      console.log('✅ Tenant created:', tenant.dbName);
    } else {
      console.log('✓ Tenant already exists:', tenant.dbName);
    }

    /* =====================================================
       3. CONNECT TO TENANT DATABASE
    ===================================================== /

    const tenantURI = BASE_URI.endsWith('/')
      ? `${BASE_URI}${tenant.dbName}`
      : `${BASE_URI}/${tenant.dbName}`;

    tenantConnection = await mongoose.createConnection(tenantURI);

    console.log('Connected to TENANT DB:', tenant.dbName);

    /* =====================================================
       4. REGISTER MODELS PROPERLY
    ===================================================== /

    const TenantUser = tenantConnection.model('User', UserSchema);
    const TenantSettings = tenantConnection.model('Settings', SettingsModel);
    const TenantContent = tenantConnection.model('Content', ContentModel);
    const TenantMedia = tenantConnection.model('Media', MediaModel);
    const TenantActivity = tenantConnection.model('ActivityLog', ActivityModel);

    /* =====================================================
       5. ADMIN USER
    ===================================================== /

    const adminExists = await TenantUser.findOne({ username: 'admin' });

    if (!adminExists) {
      await TenantUser.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        active: true
      });

      console.log('✅ Admin user created');
    } else {
      console.log('✓ Admin already exists');
    }

    /* =====================================================
       6. SETTINGS
    ===================================================== /

    const settingsExists = await TenantSettings.findOne();

    if (!settingsExists) {
      await TenantSettings.create({
        theme: {
          mode: 'light',
          primaryColor: '#db2777',
          secondaryColor: '#ec4899',
          backgroundColor: '#ffffff',
          textColor: '#0f172a',
          borderRadius: 'medium',
          shadows: true,
          animations: true
        },
        typography: {
          fontFamily: 'system',
          fontSize: 'normal',
          lineHeight: 1.5,
          letterSpacing: 'normal',
          bodyWeight: 'normal',
          headingWeight: 'bold',
          headingScale: 'normal',
          textAlign: 'left'
        },
        ui: {
          density: 'comfortable',
          buttonStyle: 'filled',
          animations: 'full'
        },
        site: {
          title: 'LIS - Landscape Integrity Solutions',
          description: 'Advancing Policy for Sustainable Landscapes',
          metaKeywords: 'think tank, environmental policy, sustainability'
        }
      });

      console.log('✅ Settings created');
    } else {
      console.log('✓ Settings already exist');
    }

    /* =====================================================
       7. CONTENT
    ===================================================== /

    const contentExists = await TenantContent.findOne({ page: 'home' });

    if (!contentExists) {
      const defaultContent = require('./defaultContent');
      await TenantContent.create(defaultContent);

      console.log('✅ Content created');
    } else {
      console.log('✓ Content already exists');
    }

    /* =====================================================
       DONE
    ===================================================== /

    console.log('\n🎉 SEED COMPLETE!');
    console.log('Tenant DB:', tenant.dbName);
    console.log('Login → admin / admin123');

    await mainConnection.close();
    await tenantConnection.close();

    console.log('🔒 Connections closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error);

    if (mainConnection) await mainConnection.close();
    if (tenantConnection) await tenantConnection.close();

    process.exit(1);
  }
};

seedDatabase();*/

/*
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
//require('dotenv').config();

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// IMPORTS
const UserSchema = require('../models/User');
const SettingsModel = require('../models/Settings');
const ContentModel = require('../models/Content');
const MediaModel = require('../models/Media');
const ActivityModel = require('../models/ActivityLog');
const Tenant = require('../models/Tenant');

// Helper: convert a string to a safe MongoDB database name
const slugify = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '_');
};

// Helper: insert database name into a MongoDB URI (handles query parameters)
const buildDatabaseURI = (baseURI, dbName) => {
  const [base, query] = baseURI.split('?');
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const newURI = `${normalizedBase}${dbName}${query ? `?${query}` : ''}`;
  return newURI;
};

const seedDatabase = async () => {
  let mainConnection;
  let tenantConAnection;

  try {
    const BASE_URI = process.env.MONGODB_URI;

    if (!BASE_URI) {
      throw new Error("MONGODB_URI not found in .env");
    }

    /* =====================================================
       1. CONNECT TO MAIN (MASTER) DATABASE
    ===================================================== /
    // Use 'master' database for tenant metadata (created automatically)
    const MAIN_DB_NAME = 'master';
    const mainURI = buildDatabaseURI(BASE_URI, MAIN_DB_NAME);

    console.log('Connecting to MAIN DB (master)...');
    mainConnection = await mongoose.createConnection(mainURI);
    console.log('Connected to MAIN DB (master)');

    const TenantModel = mainConnection.model('Tenant', Tenant.schema);

    /* =====================================================
       2. DETERMINE TENANT TO SEED
    ===================================================== /
    // Use TENANT_NAME env var, or fallback to 'Landscapes Integrity Solutions'
    const tenantName = process.env.TENANT_NAME;
    const domain = process.env.TENANT_DOMAIN;  // optional override
    let dbName = slugify(tenantName);   // e.g., 'landscapes_integrity_solutions'

    // Override dbName via env if needed (keeps backward compatibility)
    if (process.env.TENANT_DB_NAME) {
      dbName = process.env.TENANT_DB_NAME;
    }

    console.log(`\nSeeding tenant: ${tenantName} (db: ${dbName})`);

    /* =====================================================
       3. CREATE / ENSURE TENANT IN MASTER DB
    ===================================================== /
    let tenant = await TenantModel.findOne({ domain });

    if (!tenant) {
      tenant = await TenantModel.create({
        name: tenantName,
        domain: domain,
        siteId: uuidv4(),
        dbName: dbName,
        active: true
      });
      console.log('Tenant created:', tenant.dbName);
    } else {
      console.log('Tenant already exists:', tenant.dbName);
    }

    /* =====================================================
       4. CONNECT TO TENANT DATABASE (CORRECT URI)
    ===================================================== /
    const tenantURI = buildDatabaseURI(BASE_URI, tenant.dbName);
    tenantConnection = await mongoose.createConnection(tenantURI);
    console.log('Connected to TENANT DB:', tenant.dbName);

    /* =====================================================
       5. REGISTER MODELS ON TENANT CONNECTION
    ===================================================== /
    const TenantUser = tenantConnection.model('User', UserSchema);
    const TenantSettings = tenantConnection.model('Settings', SettingsModel);
    const TenantContent = tenantConnection.model('Content', ContentModel);
    const TenantMedia = tenantConnection.model('Media', MediaModel);
    const TenantActivity = tenantConnection.model('ActivityLog', ActivityModel);

    /* =====================================================
       6. ADMIN USER
    ===================================================== /
    const adminExists = await TenantUser.findOne({ username: 'admin' });
    if (!adminExists) {
      await TenantUser.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        active: true
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✓ Admin already exists');
    }

    /* =====================================================
       7. SETTINGS
    ===================================================== /
    const settingsExists = await TenantSettings.findOne();
    if (!settingsExists) {
      await TenantSettings.create({
        theme: {
          mode: 'light',
          primaryColor: '#db2777',
          secondaryColor: '#ec4899',
          backgroundColor: '#ffffff',
          textColor: '#0f172a',
          borderRadius: 'medium',
          shadows: true,
          animations: true
        },
        typography: {
          fontFamily: 'system',
          fontSize: 'normal',
          lineHeight: 1.5,
          letterSpacing: 'normal',
          bodyWeight: 'normal',
          headingWeight: 'bold',
          headingScale: 'normal',
          textAlign: 'left'
        },
        ui: {
          density: 'comfortable',
          buttonStyle: 'filled',
          animations: 'full'
        },
        site: {
          title: 'LIS - Landscape Integrity Solutions',
          description: 'Advancing Policy for Sustainable Landscapes',
          metaKeywords: 'think tank, environmental policy, sustainability'
        }
      });
      console.log('✅ Settings created');
    } else {
      console.log('✓ Settings already exist');
    }

    /* =====================================================
       8. CONTENT
    ===================================================== /
    const contentExists = await TenantContent.findOne({ page: 'home' });
    if (!contentExists) {
      const defaultContent = require('./defaultContent');
      await TenantContent.create(defaultContent);
      console.log('✅ Content created');
    } else {
      console.log('✓ Content already exists');
    }

    /* =====================================================
       DONE
    ===================================================== /
    console.log('\n🎉 SEED COMPLETE!');
    console.log(`Tenant DB: ${tenant.dbName}`);
    console.log('Login → admin / admin123');

    await mainConnection.close();
    await tenantConnection.close();
    console.log('🔒 Connections closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error);
    if (mainConnection) await mainConnection.close();
    if (tenantConnection) await tenantConnection.close();
    process.exit(1);
  }
};

seedDatabase();*/

/*
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// ==========================
// MODELS (schemas)
// ==========================
const UserSchema = require('../models/User');
const SettingsModel = require('../models/Settings');
const ContentModel = require('../models/Content');
const MediaModel = require('../models/Media');
const ActivityModel = require('../models/ActivityLog');
const Tenant = require('../models/Tenant');

// ==========================
// HELPERS
// ==========================
const slugify = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '_');
};

const buildDatabaseURI = (baseURI, dbName) => {
  const [base, query] = baseURI.split('?');
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${dbName}${query ? `?${query}` : ''}`;
};

const waitForConnection = (conn, name) => {
  return new Promise((resolve, reject) => {
    if (conn.readyState === 1) {
      console.log(`✅ ${name} already open`);
      return resolve();
    }
    conn.once('open', () => {
      console.log(`✅ ${name} connection open`);
      resolve();
    });
    conn.once('error', (err) => {
      reject(new Error(`${name} connection error: ${err.message}`));
    });
    // Timeout after 15 seconds
    setTimeout(() => reject(new Error(`${name} connection timeout after 15s`)), 15000);
  });
};

// ==========================
// MAIN SEED FUNCTION
// ==========================
const seedDatabase = async () => {
  let mainConnection = null;
  let tenantConnection = null;

  try {
    const BASE_URI = process.env.MONGODB_URI;
    if (!BASE_URI) throw new Error('❌ MONGODB_URI not found in .env');

    // ---- 1. Connect to MASTER database ----
    const MAIN_DB_NAME = 'master';
    const mainURI = buildDatabaseURI(BASE_URI, MAIN_DB_NAME);
    console.log('🔌 Connecting to MAIN DB (master)...');
    mainConnection = await mongoose.createConnection(mainURI);
    await waitForConnection(mainConnection, 'MAIN DB');

    const TenantModel = mainConnection.model('Tenant', Tenant.schema);

    // ---- 2. Tenant info from environment ----
    const tenantName = process.env.TENANT_NAME || 'Landscapes Integrity Solutions';
    const domain = process.env.TENANT_DOMAIN || 'localhost';
    let dbName = slugify(tenantName);
    if (process.env.TENANT_DB_NAME) dbName = process.env.TENANT_DB_NAME;

    console.log(`\n📋 Seeding tenant: ${tenantName} (db: ${dbName})`);

    // ---- 3. Create or retrieve tenant ----
    let tenant = await TenantModel.findOne({ domain });
    if (!tenant) {
      tenant = await TenantModel.create({
        name: tenantName,
        domain,
        siteId: uuidv4(),
        dbName,
        active: true,
      });
      console.log('✅ Tenant created:', tenant.dbName);
    } else {
      console.log('✓ Tenant already exists:', tenant.dbName);
    }

    // ---- 4. Connect to TENANT database ----
    const tenantURI = buildDatabaseURI(BASE_URI, tenant.dbName);
    console.log('🔌 Connecting to TENANT DB...');
    tenantConnection = await mongoose.createConnection(tenantURI);
    await waitForConnection(tenantConnection, 'TENANT DB');

    // ---- 5. Register models ----
    const TenantUser = tenantConnection.model('User', UserSchema);
    const TenantSettings = tenantConnection.model('Settings', SettingsModel);
    const TenantContent = tenantConnection.model('Content', ContentModel);
    const TenantMedia = tenantConnection.model('Media', MediaModel);
    const TenantActivity = tenantConnection.model('ActivityLog', ActivityModel);

    // ---- 6. Seed admin ----
    const adminExists = await TenantUser.findOne({ username: 'admin' });
    if (!adminExists) {
      await TenantUser.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        active: true,
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✓ Admin already exists');
    }

    // ---- 7. Seed settings ----
    const settingsExists = await TenantSettings.findOne();
    if (!settingsExists) {
      await TenantSettings.create({
        theme: {
          mode: 'light',
          primaryColor: '#db2777',
          secondaryColor: '#ec4899',
          backgroundColor: '#ffffff',
          textColor: '#0f172a',
          borderRadius: 'medium',
          shadows: true,
          animations: true,
        },
        typography: {
          fontFamily: 'system',
          fontSize: 'normal',
          lineHeight: 1.5,
          letterSpacing: 'normal',
          bodyWeight: 'normal',
          headingWeight: 'bold',
          headingScale: 'normal',
          textAlign: 'left',
        },
        ui: {
          density: 'comfortable',
          buttonStyle: 'filled',
          animations: 'full',
        },
        site: {
          title: 'LIS - Landscape Integrity Solutions',
          description: 'Advancing Policy for Sustainable Landscapes',
          metaKeywords: 'think tank, environmental policy, sustainability',
        },
      });
      console.log('✅ Settings created');
    } else {
      console.log('✓ Settings already exist');
    }

    // ---- 8. Seed content (skip if defaultContent.js missing) ----
    try {
      const contentExists = await TenantContent.findOne({ page: 'home' });
      if (!contentExists) {
        const defaultContent = require('./defaultContent');
        await TenantContent.create(defaultContent);
        console.log('✅ Content created');
      } else {
        console.log('✓ Content already exists');
      }
    } catch (err) {
      console.warn('⚠️ Could not seed content (defaultContent.js missing or invalid):', err.message);
    }

    // ---- 9. Done ----
    console.log('\n🎉 SEED COMPLETE!');
    console.log(`Tenant DB: ${tenant.dbName}`);
    console.log('Login → admin / admin123');

    await mainConnection.close();
    await tenantConnection.close();
    console.log('🔒 Connections closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    if (mainConnection) await mainConnection.close();
    if (tenantConnection) await tenantConnection.close();
    process.exit(1);
  }
};

seedDatabase();*/


/*last stable
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// ==========================
// MODELS (schemas)
// ==========================
const UserSchema = require('../models/User');
const SettingsModel = require('../models/Settings');
const ContentModel = require('../models/Content');
const MediaModel = require('../models/Media');
const ActivityModel = require('../models/ActivityLog');
const Tenant = require('../models/Tenant');

// ==========================
// HELPERS
// ==========================
const slugify = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '_');
};

const buildDatabaseURI = (baseURI, dbName) => {
  const [base, query] = baseURI.split('?');
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${dbName}${query ? `?${query}` : ''}`;
};

const waitForConnection = (conn, name) => {
  return new Promise((resolve, reject) => {
    if (conn.readyState === 1) {
      console.log(`✅ ${name} already open`);
      return resolve();
    }
    conn.once('open', () => {
      console.log(`✅ ${name} connection open`);
      resolve();
    });
    conn.once('error', (err) => {
      reject(new Error(`${name} connection error: ${err.message}`));
    });
    // Timeout after 15 seconds
    setTimeout(() => reject(new Error(`${name} connection timeout after 15s`)), 15000);
  });
};

// ==========================
// MAIN SEED FUNCTION
// ==========================
const seedDatabase = async () => {
  let mainConnection = null;
  let tenantConnection = null;

  try {
    const BASE_URI = process.env.MONGODB_URI;
    if (!BASE_URI) throw new Error('❌ MONGODB_URI not found in .env');

    // ---- 1. Connect to MASTER database ----
    const MAIN_DB_NAME = 'master';
    const mainURI = buildDatabaseURI(BASE_URI, MAIN_DB_NAME);
    console.log('🔌 Connecting to MAIN DB (master)...');
    mainConnection = await mongoose.createConnection(mainURI);
    await waitForConnection(mainConnection, 'MAIN DB');

    const TenantModel = mainConnection.model('Tenant', Tenant.schema);

    // ---- 2. Tenant info from environment ----
    const tenantName = process.env.TENANT_NAME ;
    let domain = process.env.TENANT_DOMAIN ;
    if (!domain) {
      domain = `${slugify(tenantName)}.localhost`;
    }
    let dbName = slugify(tenantName);
    if (process.env.TENANT_DB_NAME) dbName = process.env.TENANT_DB_NAME;
     console.log(`\n📋 Seeding tenant: ${tenantName}`);
    console.log(`🌐 Domain: ${domain}`);
    console.log(`💾 Database: ${dbName}`);

    //let dbName = slugify(tenantName);
    //if (process.env.TENANT_DB_NAME) dbName = process.env.TENANT_DB_NAME;

    //console.log(`\n📋 Seeding tenant: ${tenantName} (db: ${dbName})`);

    // ---- 3. Create or retrieve tenant ----
    let tenant = await TenantModel.findOne({ domain });
    if (!tenant) {
      tenant = await TenantModel.create({
        name: tenantName,
        domain,
        siteId: uuidv4(),
        dbName,
        active: true,
      });
      console.log('✅ Tenant created:', tenant.dbName);
    } else {
      console.log('✓ Tenant already exists:', tenant.dbName);
    }

    // ---- 4. Connect to TENANT database ----
    const tenantURI = buildDatabaseURI(BASE_URI, tenant.dbName);
    console.log('🔌 Connecting to TENANT DB...');
    tenantConnection = await mongoose.createConnection(tenantURI);
    await waitForConnection(tenantConnection, 'TENANT DB');

    // ---- 5. Register models ----
    const TenantUser = tenantConnection.model('User', UserSchema);
    const TenantSettings = tenantConnection.model('Settings', SettingsModel);
    const TenantContent = tenantConnection.model('Content', ContentModel);
    const TenantMedia = tenantConnection.model('Media', MediaModel);
    const TenantActivity = tenantConnection.model('ActivityLog', ActivityModel);

    // ---- 6. Seed admin ----
    const adminExists = await TenantUser.findOne({ username: 'admin' });
    if (!adminExists) {
      await TenantUser.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        active: true,
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✓ Admin already exists');
    }

    // ---- 7. Seed settings ----
    const settingsExists = await TenantSettings.findOne();
    if (!settingsExists) {
      await TenantSettings.create({
        theme: {
          mode: 'light',
          primaryColor: '#db2777',
          secondaryColor: '#ec4899',
          backgroundColor: '#ffffff',
          textColor: '#0f172a',
          borderRadius: 'medium',
          shadows: true,
          animations: true,
        },
        typography: {
          fontFamily: 'system',
          fontSize: 'normal',
          lineHeight: 1.5,
          letterSpacing: 'normal',
          bodyWeight: 'normal',
          headingWeight: 'bold',
          headingScale: 'normal',
          textAlign: 'left',
        },
        ui: {
          density: 'comfortable',
          buttonStyle: 'filled',
          animations: 'full',
        },
        site: {
          title: 'LIS - Landscape Integrity Solutions',
          description: 'Advancing Policy for Sustainable Landscapes',
          metaKeywords: 'think tank, environmental policy, sustainability',
        },
      });
      console.log('✅ Settings created');
    } else {
      console.log('✓ Settings already exist');
    }

    // ---- 8. Seed content (skip if defaultContent.js missing) ----
    try {
      const contentExists = await TenantContent.findOne({ page: 'home' });
      if (!contentExists) {
        const defaultContent = require('../../../scripts/defaultContent');
        await TenantContent.create(defaultContent);
        console.log('✅ Content created');
      } else {
        console.log('✓ Content already exists');
      }
    } catch (err) {
      console.warn('⚠️ Could not seed content (defaultContent.js missing or invalid):', err.message);
    }

    // ---- 9. Done ----
    console.log('\n🎉 SEED COMPLETE!');
    console.log(`Tenant DB: ${tenant.dbName}`);
    console.log('Login → admin / admin123');

    await mainConnection.close();
    await tenantConnection.close();
    console.log('🔒 Connections closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    if (mainConnection) await mainConnection.close();
    if (tenantConnection) await tenantConnection.close();
    process.exit(1);
  }
};

seedDatabase();*/

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from '../../config/env.js';
import connectDB, { getMasterConnection } from '../../config/database.js';
import { UserModel } from '../models/user.model.js';
import { TenantModel } from '../models/tenant.model.js';
import { SettingsModel } from '../models/settings.model.js';
import { ContentModel } from '../models/content.model.js';
import { logger } from '../../config/logger.js';

// Default content data (import from your existing scripts/defaultContent.js)
const DEFAULT_CONTENT = {
  home: {
    page: 'home',
    published: true,
    hero: { headline: 'Welcome', subtext: 'Your platform for sustainability' },
    // ... full content structure from your defaultContent.js
  },
  about: { page: 'about', published: true },
  research: { page: 'research', published: true },
  contact: { page: 'contact', published: true },
};

/**
 * Seed master database with default tenant and superadmin.
 */
const seedMaster = async () => {
  const masterConn = await getMasterConnection();
  const Tenant = masterConn.model('Tenant', TenantModel.schema);
  const MasterUser = masterConn.model('MasterUser', require('../models/masterUser.model.js').MasterUserModel.schema);

  // Create default tenant if not exists
  let tenant = await Tenant.findOne({ dbName: 'demo_tenant' });
  if (!tenant) {
    tenant = await Tenant.create({
      name: 'Demo Tenant',
      domain: 'demo.localhost',
      dbName: 'demo_tenant',
      siteId: 'demo-001',
      contactEmail: 'admin@demo.com',
    });
    logger.info('Created demo tenant');
  }

  // Create superadmin if not exists
  let superadmin = await MasterUser.findOne({ email: 'admin@example.com' });
  if (!superadmin) {
    superadmin = await MasterUser.create({
      email: 'admin@example.com',
      name: 'Super Admin',
      role: 'superadmin',
    });
    logger.info('Created superadmin user');
  }
};

/**
 * Seed a tenant database with default admin user, settings, and content.
 * @param {string} tenantId - The tenant database name
 */
const seedTenant = async (tenantId) => {
  const conn = await connectDB(tenantId);
  const User = conn.model('User', UserModel.schema);
  const Settings = conn.model('Settings', SettingsModel.schema);
  const Content = conn.model('Content', ContentModel.schema);

  // Create admin user
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      active: true,
      tenantId,
    });
    logger.info(`Created admin user for tenant ${tenantId}`);
  }

  // Create default settings
  const settingsExist = await Settings.findOne();
  if (!settingsExist) {
    await Settings.create({ tenantId });
    logger.info(`Created default settings for tenant ${tenantId}`);
  }

  // Seed content pages
  for (const [page, data] of Object.entries(DEFAULT_CONTENT)) {
    const exists = await Content.findOne({ page });
    if (!exists) {
      await Content.create({ ...data, tenantId, updatedBy: 'system' });
      logger.info(`Seeded content page "${page}" for tenant ${tenantId}`);
    }
  }
};

/**
 * Main seed function – run only in development or via CLI.
 */
export const seedAll = async () => {
  try {
    await seedMaster();
    // Seed demo tenant
    await seedTenant('demo_tenant');
    logger.info('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Seeding failed');
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAll();
}