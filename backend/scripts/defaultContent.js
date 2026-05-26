// backend/scripts/seed-icta-content.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const TENANT_DB_NAME = 'icta_sample';

// Import the Content model
import { ContentModel } from '../src/database/models/content.model.js';

const ICTA_FULL_CONTENT = {
  page: "home",
  tenantId: TENANT_DB_NAME,
  published: true,
  version: 1,
  updatedBy: "system",
  
  navigation: [
    { name: "Home", href: "/", icon: "home" },
    { name: "About", href: "/about", icon: "info" },
    { name: "Research", href: "/research", icon: "science" },
    { name: "Contact", href: "/contact", icon: "mail" }
  ],
  
  hero: {
    badge: "Vision 2030 Partner",
    headline: "Powering Kenya's",
    highlightedText: "Digital Economy",
    headlineEnd: "",
    description: "The National Digital Masterplan 2022-2032 is transforming Kenya into a regional ICT hub through innovation, infrastructure, and e-government.",
    primaryButtonText: "Download Masterplan",
    secondaryButtonText: "View Roadmap",
    backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCaw5m81nNM0MZpSeCDSNMR8jtfNYnp9g_sDz_8asKYKGnthRVAskslJIAjiTmbaHXZ-vuirL6iauAcncqAt2woss8Pecc8hsmRThlmME0jN_5qDagGnFTfiLbp_Y4Sx7RcnMmq8qrWjUUOJO9pG6aZIEuGw-SvSgEoJcX3KrjoAOVTpUcVGUDF4-f--biRylHhvozDmzE6pQWv7ZzideKNjDPIdBVCPFQgaRA2Ih0i3203IltxKnEwHLmMXevAasWpWNy8mdawQ",
    announcementBadge: "",
    announcementText: "",
    subtext: "",
    features: []
  },
  
  about: {
    badge: "",
    title: "About ICT Authority",
    description1: "The Authority's broad mandate entails enforcing ICT standards in Government, establishing, developing and maintaining secure ICT infrastructure systems, supervision of electronic communications, as well as promoting digital literacy, capacity, innovation and enterprise.",
    description2: "",
    stats: [],
    features: [],
    image: ""
  },
  
  aboutItems: [
    {
      icon: "https://icta.go.ke//assets/images/icons/digi.png",
      title: "Enabling Connectivity",
      description: "Through NOFBI and County Connectivity Project we are enabling access to information.",
      link: "https://icta.go.ke/page?q=6&type=about_ict_authority"
    },
    {
      icon: "https://icta.go.ke//assets/images/icons/stds.png",
      title: "Partnering for Growth",
      description: "Collaborating with local and international stakeholders for ICT adoption and use.",
      link: "https://icta.go.ke/page?q=6&type=about_ict_authority"
    },
    {
      icon: "https://icta.go.ke//assets/images/icons/jobs.png",
      title: "E-Government",
      description: "Easy, convenient and efficient access to government services by the citizenry.",
      link: "https://icta.go.ke/page?q=6&type=about_ict_authority"
    },
    {
      icon: "https://icta.go.ke//assets/images/icons/conns.png",
      title: "Enforcing Standards",
      description: "To ensure alignment and consistency of government ICT plans and processes at all.",
      link: "https://icta.go.ke/page?q=6&type=about_ict_authority"
    }
  ],
  
  masterplanTabs: [
    {
      id: "masterplan",
      title: "National Digital Masterplan",
      description: "The Kenya National Digital Master Plan 2022-2032 is a blueprint for leveraging and deepening the contribution of ICT to accelerate economic growth.",
      ctaLink: "https://cms.icta.go.ke/sites/default/files/2022-09/Kenya_Digital_Master_Plan_2022-2023.pdf",
      ctaText: "explore more",
      items: [
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2022-01/Digitalent-1.png",
          title: "Digital Infrastructure",
          description: "Through this pillar we are delivering equitable accessible critical national ICT infrastructure such as NOFBI"
        },
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2022-01/Digitalent-1.png",
          title: "Digital Government Service, Product and Data Management",
          description: "Through this pillar we are providing e-Government information and services for improved productivity, efficiency, effectiveness and governance in all sectors."
        },
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2022-01/Digitalent-1.png",
          title: "Digital Skills",
          description: "Through this pillar we are training and increased the number of a digitally skilled workforce and citizens grounded on ethical practices"
        },
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2022-01/Digitalent-1.png",
          title: "Digital Innovation, Enterprise and Digital Business",
          description: "Through this pillar we seek to enhance the innovation value chain in order to turn innovative ideas into sustainable businesses"
        }
      ]
    },
    {
      id: "citizens",
      title: "For Citizens",
      description: "The Information and Communication Technology (ICT) Authority is a State Corporation under the Ministry of Information Communication and Technology.",
      ctaLink: "https://icta.go.ke/page?q=17&type=citizens",
      ctaText: "explore more",
      items: [
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2021-12/digi_2.png",
          title: "E-Services",
          description: "Through the e-Citizen web portal the public has online access to a number of public services offered by various Government Ministries"
        },
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2021-12/digi_2.png",
          title: "DigiSchool",
          description: "The Digital Literacy Programme (DLP) is targeted at learners in all public primary schools"
        },
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2021-12/digi_2.png",
          title: "Talent and Workforce Building",
          description: "The ICT Authority in collaboration with other ICT stakeholders has developed programmes to manage the challenge of the gap between"
        },
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2021-12/digi_2.png",
          title: "Information Security",
          description: "As many of the public services become digitised and available online, the government has increased its efforts to protect information"
        }
      ]
    },
    {
      id: "partners",
      title: "Huawei Technologies (Kenya) Co. Ltd",
      description: "In partnership with Huawei Technologies, the ICT Authority seeks to promote ICT literacy and capacity; ICT infrastructure development; access to devices and the internet; and promote ICT research",
      ctaLink: "https://icta.go.ke/page?q=28&type=investors",
      ctaText: "explore more",
      items: []
    }
  ],
  
  news: {
    badge: "",
    title: "Latest News & Events",
    description: "Get the latest news & event briefs from the ICT industry",
    items: [
      {
        id: 1,
        title: "Notice of Early Market Engagement (EME) – Kenya Digital Economy Acceleration Project (KDEAP)",
        description: "The Information and Communications Technology Authority, with financing from World Bank under the Kenya Digital Economy Acceleration Project (KDEAP), invites industry stakeholders to participate in...",
        image: "https://cms.icta.go.ke//sites/default/files/2026-03/market.jpeg",
        link: "https://icta.go.ke/news?node=823&type=news",
        date: ""
      },
      {
        id: 2,
        title: "PDTP Cohort X Recruitment (2025-2026 intake)",
        description: "",
        image: "https://cms.icta.go.ke//sites/default/files/2025-08/Newssectionn.png",
        link: "https://icta.go.ke/news?node=785&type=news",
        date: ""
      },
      {
        id: 3,
        title: "Dar-es-Salaam - Mombasa Terrestrial Fibre Link at the Lunga Lunga/Horohoro border",
        description: "Kenya and Tanzania officially launched the Dar-es-Salaam to Mombasa Terrestrial Fibre Link at the Lunga Lunga/Horohoro border.",
        image: "https://cms.icta.go.ke//sites/default/files/2025-07/TTCL.jpg",
        link: "https://icta.go.ke/news?node=772&type=news",
        date: ""
      }
    ]
  },
  
  quickLinks: [
    {
      title: "e-Government Services",
      href: "https://www.ecitizen.go.ke/",
      icon: "https://cms.icta.go.ke//sites/default/files/2022-05/icon-3.png",
      alt: "e-Government Services"
    },
    {
      title: "Digital infrastructure",
      href: "https://icta.go.ke/page?q=205&type=projects",
      icon: "https://cms.icta.go.ke//sites/default/files/2022-05/icon-2.png",
      alt: "Digital infrastructure"
    },
    {
      title: "Smart Academy",
      href: "https://www.smartacademy.go.ke/",
      icon: "https://cms.icta.go.ke//sites/default/files/2022-05/icon-1.png",
      alt: "Smart Academy"
    },
    {
      title: "Digital Innovation",
      href: "https://icta.go.ke/page?q=17&type=citizens",
      icon: "https://cms.icta.go.ke//sites/default/files/2022-06/Digital%20innovation_0.png",
      alt: "Digital Innovation"
    }
  ],
  
  topNavLinks: [
    { label: "info@ict.go.ke", href: "mailto:info@ict.go.ke", icon: "mail", external: true },
    { label: "Strategic Plan 2024-2027", href: "https://cms.icta.go.ke/sites/default/files/2024-09/SP_2024_-_2027_0912.pdf", external: true },
    { label: "National Digital Masterplan", href: "https://cms.icta.go.ke/sites/default/files/2022-09/Kenya_Digital_Master_Plan_2022-2023.pdf", external: true },
    { label: "Service Charter (Audio)", href: "https://www.youtube.com/watch?v=alP08G5_XuA", external: true },
    { label: "Gallery", href: "https://icta.go.ke/gallery", external: true },
    { label: "Downloads", href: "https://www.icta.go.ke/downloads", external: true }
  ],
  
  mainNavItems: [
    { label: "Connected Africa 2026", href: "https://connected.go.ke/", external: true },
    {
      label: "Who We Are",
      dropdown: [
        { label: "About Us", href: "https://icta.go.ke/page?q=6&type=about_ict_authority", external: true },
        { label: "Board of Directors", href: "https://icta.go.ke/board", external: true },
        { label: "Management", href: "https://icta.go.ke/management", external: true },
        { label: "Our Partnerships", href: "https://icta.go.ke/page?q=240&type=partnerships", external: true },
        { label: "Our Regional Offices", href: "https://icta.go.ke/contact-us", external: true }
      ]
    },
    {
      label: "Projects",
      dropdown: [
        { label: "Kenya Open Data", href: "https://icta.go.ke/page?q=100&type=projects", external: true },
        { label: "Smart County", href: "https://icta.go.ke/page?q=101&type=projects", external: true },
        { label: "TIMS", href: "https://icta.go.ke/page?q=102&type=projects", external: true },
        { label: "IFMIS", href: "https://icta.go.ke/page?q=103&type=projects", external: true },
        { label: "Center of Excellence", href: "https://icta.go.ke/page?q=104&type=projects", external: true },
        { label: "The GDC", href: "https://icta.go.ke/page?q=204&type=projects", external: true },
        { label: "Public Key Infrastructure", href: "https://icta.go.ke/page?q=205&type=projects", external: true }
      ]
    },
    {
      label: "ICT Standards",
      dropdown: [
        { label: "ICT Standards", href: "https://icta.go.ke/ict-standards", external: true },
        { label: "ICT Supplier Accreditation", href: "https://accreditation.icta.go.ke/", external: true },
        { label: "ICT Professionals Accreditation", href: "https://professionals.icta.go.ke/", external: true },
        { label: "MCDA Assessment", href: "https://sas.icta.go.ke/", external: true },
        { label: "Masomo Learning Portal", href: "https://masomo.icta.go.ke/", external: true }
      ]
    },
    { label: "Accreditation", href: "https://accreditation.icta.go.ke/", external: true },
    { label: "Tenders", href: "https://icta.go.ke/tenders", external: true },
    { label: "Careers", href: "https://icta.go.ke/careers", external: true },
    { label: "For Citizens", href: "https://icta.go.ke/page?q=17&type=citizens", external: true },
    { label: "Partnerships", href: "https://icta.go.ke/page?q=28&type=investors", external: true },
    { label: "Media Center", href: "https://icta.go.ke/news", external: true },
    {
      label: "Resources",
      dropdown: [
        { label: "Presentations", href: "https://icta.go.ke/presentations", external: true },
        { label: "Tenders", href: "https://icta.go.ke/tenders", external: true }
      ]
    },
    { label: "Feedback", href: "https://icta.go.ke/contact-us", external: true }
  ],
  
  areas: [],
  partners: { badge: "", title: "", description: "", categories: [], logos: [] },
  research: [],
  advisory: [],
  testimonials: [],
  contact: {
    sectionTitle: { text1: "", text2: "", text3: "" },
    form: { nameLabel: "", namePlaceholder: "", emailLabel: "", emailPlaceholder: "", messageLabel: "", messagePlaceholder: "", submitText: "" }
  },
  cta: { title: "", description: "", primaryButtonText: "", secondaryButtonText: "" },
  footer: {
    description: "",
    copyright: "ICT Authority. All rights reserved.",
    quickLinks: [
      { name: "Ministry of ICT", href: "http://www.information.go.ke/" },
      { name: "KEPROBA", href: "https://brand.ke/" },
      { name: "E-citizen Portal", href: "https://www.ecitizen.go.ke/" }
    ],
    socialLinks: [
      { icon: "facebook", href: "https://web.facebook.com/ICTAuthorityKE" },
      { icon: "twitter", href: "https://twitter.com/ICTAuthorityKE" }
    ],
    legalLinks: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" }
    ]
  },
  privacyPolicy: { title: "", lastUpdated: "", sections: [], contactEmail: "", contactPhone: "", contactAddress: "" },
  termsOfUse: { title: "", effectiveDate: "", sections: [], contactEmail: "" },
  accessibility: { title: "", lastUpdated: "", sections: [], contactEmail: "", contactPhone: "", contactAddress: "" }
};

async function seedContent() {
  let connection = null;
  
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined in .env');
    }

    // Connect directly to the tenant database
    connection = await mongoose.createConnection(mongoUri, {
      dbName: TENANT_DB_NAME
    });
    
    console.log(`✅ Connected to database: ${TENANT_DB_NAME}`);

    // Get the Content model for this connection
    const Content = connection.model('Content', ContentModel.schema);
    
    // Delete existing content
    const deleted = await Content.deleteMany({ tenantId: TENANT_DB_NAME, page: 'home' });
    console.log(`🗑️ Deleted ${deleted.deletedCount} existing home content documents`);
    
    // Insert new content
    const result = await Content.create(ICTA_FULL_CONTENT);
    console.log('✅ Seeded full ICT Authority content');
    console.log(`   ID: ${result._id}`);
    console.log(`   Tenant: ${TENANT_DB_NAME}`);
    
    // Verify the content
    const saved = await Content.findOne({ tenantId: TENANT_DB_NAME, page: 'home' }).lean();
    console.log('\n📊 Verification:');
    console.log(`   aboutItems: ${saved.aboutItems?.length || 0} items`);
    console.log(`   masterplanTabs: ${saved.masterplanTabs?.length || 0} tabs`);
    console.log(`   news items: ${saved.news?.items?.length || 0} items`);
    console.log(`   quickLinks: ${saved.quickLinks?.length || 0} links`);
    console.log(`   topNavLinks: ${saved.topNavLinks?.length || 0} links`);
    console.log(`   mainNavItems: ${saved.mainNavItems?.length || 0} items`);
    
    if (saved.aboutItems?.length > 0 && saved.masterplanTabs?.length > 0) {
      console.log('\n✅ All ICT Authority fields successfully saved to database!');
    } else {
      console.log('\n⚠️ Warning: Some fields may not have been saved correctly');
    }
    
    console.log('\n🎉 Seeding completed!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

seedContent();

/*import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { ContentModel } from '../src/database/models/content.model.js';
import connectDB from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const TENANT_NAME = process.env.TENANT_NAME || 'landscapes_integrity_solutions';

// ICT Authority Default Content
const ICTA_DEFAULT_CONTENT = {
  page: "home",
  published: true,
  version: 1,
  updatedBy: "system",
  
  // Top navigation links (red bar)
  topNavLinks: [
    { label: "info@ict.go.ke", href: "mailto:info@ict.go.ke", icon: "mail", external: true },
    { label: "Strategic Plan 2024-2027", href: "https://cms.icta.go.ke/sites/default/files/2024-09/SP_2024_-_2027_0912.pdf", external: true },
    { label: "National Digital Masterplan", href: "https://cms.icta.go.ke/sites/default/files/2022-09/Kenya_Digital_Master_Plan_2022-2023.pdf", external: true },
    { label: "Service Charter (Audio)", href: "https://www.youtube.com/watch?v=alP08G5_XuA", external: true },
    { label: "Gallery", href: "https://icta.go.ke/gallery", external: true },
    { label: "Downloads", href: "https://www.icta.go.ke/downloads", external: true }
  ],
  
  // Main navigation items
  mainNavItems: [
    { label: "Connected Africa 2026", href: "https://connected.go.ke/", external: true },
    {
      label: "Who We Are",
      dropdown: [
        { label: "About Us", href: "https://icta.go.ke/page?q=6&type=about_ict_authority", external: true },
        { label: "Board of Directors", href: "https://icta.go.ke/board", external: true },
        { label: "Management", href: "https://icta.go.ke/management", external: true },
        { label: "Our Partnerships", href: "https://icta.go.ke/page?q=240&type=partnerships", external: true },
        { label: "Our Regional Offices", href: "https://icta.go.ke/contact-us", external: true }
      ]
    },
    {
      label: "Projects",
      dropdown: [
        { label: "Kenya Open Data", href: "https://icta.go.ke/page?q=100&type=projects", external: true },
        { label: "Smart County", href: "https://icta.go.ke/page?q=101&type=projects", external: true },
        { label: "TIMS", href: "https://icta.go.ke/page?q=102&type=projects", external: true },
        { label: "IFMIS", href: "https://icta.go.ke/page?q=103&type=projects", external: true },
        { label: "Center of Excellence", href: "https://icta.go.ke/page?q=104&type=projects", external: true },
        { label: "The GDC", href: "https://icta.go.ke/page?q=204&type=projects", external: true },
        { label: "Public Key Infrastructure", href: "https://icta.go.ke/page?q=205&type=projects", external: true }
      ]
    },
    {
      label: "ICT Standards",
      dropdown: [
        { label: "ICT Standards", href: "https://icta.go.ke/ict-standards", external: true },
        { label: "ICT Supplier Accreditation", href: "https://accreditation.icta.go.ke/", external: true },
        { label: "ICT Professionals Accreditation", href: "https://professionals.icta.go.ke/", external: true },
        { label: "MCDA Assessment", href: "https://sas.icta.go.ke/", external: true },
        { label: "Masomo Learning Portal", href: "https://masomo.icta.go.ke/", external: true }
      ]
    },
    { label: "Accreditation", href: "https://accreditation.icta.go.ke/", external: true },
    { label: "Tenders", href: "https://icta.go.ke/tenders", external: true },
    { label: "Careers", href: "https://icta.go.ke/careers", external: true },
    { label: "For Citizens", href: "https://icta.go.ke/page?q=17&type=citizens", external: true },
    { label: "Partnerships", href: "https://icta.go.ke/page?q=28&type=investors", external: true },
    { label: "Media Center", href: "https://icta.go.ke/news", external: true },
    {
      label: "Resources",
      dropdown: [
        { label: "Presentations", href: "https://icta.go.ke/presentations", external: true },
        { label: "Tenders", href: "https://icta.go.ke/tenders", external: true }
      ]
    },
    { label: "Feedback", href: "https://icta.go.ke/contact-us", external: true }
  ],
  
  // Hero Section
  hero: {
    badge: "Vision 2030 Partner",
    headline: "Powering Kenya's",
    highlightedText: "Digital Economy",
    headlineEnd: "",
    description: "The National Digital Masterplan 2022-2032 is transforming Kenya into a regional ICT hub through innovation, infrastructure, and e-government.",
    primaryButtonText: "Download Masterplan",
    secondaryButtonText: "View Roadmap",
    backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCaw5m81nNM0MZpSeCDSNMR8jtfNYnp9g_sDz_8asKYKGnthRVAskslJIAjiTmbaHXZ-vuirL6iauAcncqAt2woss8Pecc8hsmRThlmME0jN_5qDagGnFTfiLbp_Y4Sx7RcnMmq8qrWjUUOJO9pG6aZIEuGw-SvSgEoJcX3KrjoAOVTpUcVGUDF4-f--biRylHhvozDmzE6pQWv7ZzideKNjDPIdBVCPFQgaRA2Ih0i3203IltxKnEwHLmMXevAasWpWNy8mdawQ"
  },
  
  // About Section
  about: {
    badge: "",
    title: "About ICT Authority",
    description1: "The Authority's broad mandate entails enforcing ICT standards in Government, establishing, developing and maintaining secure ICT infrastructure systems, supervision of electronic communications, as well as promoting digital literacy, capacity, innovation and enterprise.",
    description2: "",
    stats: [],
    features: [],
    image: ""
  },
  
  // About Items (4 cards in About section)
  aboutItems: [
    {
      icon: "https://icta.go.ke//assets/images/icons/digi.png",
      title: "Enabling Connectivity",
      description: "Through NOFBI and County Connectivity Project we are enabling access to information.",
      link: "https://icta.go.ke/page?q=6&type=about_ict_authority"
    },
    {
      icon: "https://icta.go.ke//assets/images/icons/stds.png",
      title: "Partnering for Growth",
      description: "Collaborating with local and international stakeholders for ICT adoption and use.",
      link: "https://icta.go.ke/page?q=6&type=about_ict_authority"
    },
    {
      icon: "https://icta.go.ke//assets/images/icons/jobs.png",
      title: "E-Government",
      description: "Easy, convenient and efficient access to government services by the citizenry.",
      link: "https://icta.go.ke/page?q=6&type=about_ict_authority"
    },
    {
      icon: "https://icta.go.ke//assets/images/icons/conns.png",
      title: "Enforcing Standards",
      description: "To ensure alignment and consistency of government ICT plans and processes at all.",
      link: "https://icta.go.ke/page?q=6&type=about_ict_authority"
    }
  ],
  
  // Masterplan Tabs
  masterplanTabs: [
    {
      id: "masterplan",
      title: "National Digital Masterplan",
      description: "The Kenya National Digital Master Plan 2022-2032 is a blueprint for leveraging and deepening the contribution of ICT to accelerate economic growth.",
      ctaLink: "https://cms.icta.go.ke/sites/default/files/2022-09/Kenya_Digital_Master_Plan_2022-2023.pdf",
      ctaText: "explore more",
      items: [
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2022-01/Digitalent-1.png",
          title: "Digital Infrastructure",
          description: "Through this pillar we are delivering equitable accessible critical national ICT infrastructure such as NOFBI"
        },
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2022-01/Digitalent-1.png",
          title: "Digital Government Service, Product and Data Management",
          description: "Through this pillar we are providing e-Government information and services for improved productivity, efficiency, effectiveness and governance in all sectors."
        },
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2022-01/Digitalent-1.png",
          title: "Digital Skills",
          description: "Through this pillar we are training and increased the number of a digitally skilled workforce and citizens grounded on ethical practices"
        },
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2022-01/Digitalent-1.png",
          title: "Digital Innovation, Enterprise and Digital Business",
          description: "Through this pillar we seek to enhance the innovation value chain in order to turn innovative ideas into sustainable businesses"
        }
      ]
    },
    {
      id: "citizens",
      title: "For Citizens",
      description: "The Information and Communication Technology (ICT) Authority is a State Corporation under the Ministry of Information Communication and Technology.",
      ctaLink: "https://icta.go.ke/page?q=17&type=citizens",
      ctaText: "explore more",
      items: [
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2021-12/digi_2.png",
          title: "E-Services",
          description: "Through the e-Citizen web portal the public has online access to a number of public services offered by various Government Ministries"
        },
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2021-12/digi_2.png",
          title: "DigiSchool",
          description: "The Digital Literacy Programme (DLP) is targeted at learners in all public primary schools"
        },
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2021-12/digi_2.png",
          title: "Talent and Workforce Building",
          description: "The ICT Authority in collaboration with other ICT stakeholders has developed programmes to manage the challenge of the gap between"
        },
        {
          icon: "https://cms.icta.go.ke//sites/default/files/2021-12/digi_2.png",
          title: "Information Security",
          description: "As many of the public services become digitised and available online, the government has increased its efforts to protect information"
        }
      ]
    },
    {
      id: "partners",
      title: "Huawei Technologies (Kenya) Co. Ltd",
      description: "In partnership with Huawei Technologies, the ICT Authority seeks to promote ICT literacy and capacity; ICT infrastructure development; access to devices and the internet; and promote ICT research",
      ctaLink: "https://icta.go.ke/page?q=28&type=investors",
      ctaText: "explore more",
      items: []
    }
  ],
  
  // News Section
  news: {
    badge: "",
    title: "Latest News & Events",
    description: "Get the latest news & event briefs from the ICT industry",
    items: [
      {
        id: 1,
        title: "Notice of Early Market Engagement (EME) – Kenya Digital Economy Acceleration Project (KDEAP)",
        description: "The Information and Communications Technology Authority, with financing from World Bank under the Kenya Digital Economy Acceleration Project (KDEAP), invites industry stakeholders to participate in...",
        image: "https://cms.icta.go.ke//sites/default/files/2026-03/market.jpeg",
        link: "https://icta.go.ke/news?node=823&type=news"
      },
      {
        id: 2,
        title: "PDTP Cohort X Recruitment (2025-2026 intake)",
        description: "",
        image: "https://cms.icta.go.ke//sites/default/files/2025-08/Newssectionn.png",
        link: "https://icta.go.ke/news?node=785&type=news"
      },
      {
        id: 3,
        title: "Dar-es-Salaam - Mombasa Terrestrial Fibre Link at the Lunga Lunga/Horohoro border",
        description: "Kenya and Tanzania officially launched the Dar-es-Salaam to Mombasa Terrestrial Fibre Link at the Lunga Lunga/Horohoro border.",
        image: "https://cms.icta.go.ke//sites/default/files/2025-07/TTCL.jpg",
        link: "https://icta.go.ke/news?node=772&type=news"
      }
    ]
  },
  
  // Quick Links
  quickLinks: [
    {
      title: "e-Government Services",
      href: "https://www.ecitizen.go.ke/",
      icon: "https://cms.icta.go.ke//sites/default/files/2022-05/icon-3.png",
      alt: "e-Government Services"
    },
    {
      title: "Digital infrastructure",
      href: "https://icta.go.ke/page?q=205&type=projects",
      icon: "https://cms.icta.go.ke//sites/default/files/2022-05/icon-2.png",
      alt: "Digital infrastructure"
    },
    {
      title: "Smart Academy",
      href: "https://www.smartacademy.go.ke/",
      icon: "https://cms.icta.go.ke//sites/default/files/2022-05/icon-1.png",
      alt: "Smart Academy"
    },
    {
      title: "Digital Innovation",
      href: "https://icta.go.ke/page?q=17&type=citizens",
      icon: "https://cms.icta.go.ke//sites/default/files/2022-06/Digital%20innovation_0.png",
      alt: "Digital Innovation"
    }
  ],
  
  // Footer
  footer: {
    description: "",
    quickLinks: [
      { name: "Ministry of ICT", href: "http://www.information.go.ke/" },
      { name: "KEPROBA", href: "https://brand.ke/" },
      { name: "E-citizen Portal", href: "https://www.ecitizen.go.ke/" },
      { name: "Export Promotion Council(EPC)", href: "https://www.epckenya.org/" },
      { name: "The Export Processing Zones Authority", href: "https://epzakenya.com/" },
      { name: "Huduma Centre", href: "https://www.hudumakenya.go.ke/" },
      { name: "KenInvest", href: "http://www.invest.go.ke/" },
      { name: "Konza Techno City", href: "https://konza.go.ke/" },
      { name: "The Presidency", href: "https://www.president.go.ke/" },
      { name: "Kenya Vision 2030", href: "http://vision2030.go.ke/" },
      { name: "eWaste Kenya", href: "https://ewaste.go.ke/" }
    ],
    affiliatedSites: [
      { name: "Connected Summit", href: "https://www.connected.go.ke/" },
      { name: "Smart Academy", href: "https://smartacademy.go.ke/" },
      { name: "DigiTalent", href: "https://digitalent.go.ke/" },
      { name: "Kenya Open Data", href: "https://opendata.go.ke/" }
    ],
    resources: [
      { name: "Tenders", href: "https://icta.go.ke/tenders" },
      { name: "Frequently Asked Questions (FAQs)", href: "https://icta.go.ke/faqs" },
      { name: "Contact Us", href: "https://icta.go.ke/contact-us" }
    ],
    ictaLinks: [
      { name: "WhiteBox", href: "https://whitebox.go.ke" }
    ],
    contact: {
      address: "",
      email: "",
      phone: ""
    },
    socialLinks: [
      { icon: "facebook", href: "https://web.facebook.com/ICTAuthorityKE" },
      { icon: "twitter", href: "https://twitter.com/ICTAuthorityKE" },
      { icon: "mail", href: "mailto:communications@ict.go.ke" },
      { icon: "linkedin", href: "https://www.linkedin.com/company/kenya-ict-board" }
    ],
    copyright: "ICT Authority. All rights reserved.",
    legalLinks: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Sitemap", href: "/sitemap" }
    ]
  },
  
  // Testimonials
  testimonials: [],
  
  // CTA
  cta: {
    title: "",
    description: "",
    primaryButtonText: "",
    secondaryButtonText: ""
  },
  
  // Contact
  contact: {
    sectionTitle: {
      text1: "",
      text2: "",
      text3: ""
    },
    form: {
      nameLabel: "",
      namePlaceholder: "",
      emailLabel: "",
      emailPlaceholder: "",
      messageLabel: "",
      messagePlaceholder: "",
      submitText: ""
    }
  }
};

async function seedContent() {
  try {
    const connection = await connectDB(TENANT_NAME);
    
    // Get the content model for this tenant
    const Content = connection.model('Content', (await import('../src/database/models/content.model.js')).ContentModel.schema);
    
    // Check if content already exists
    const existing = await Content.findOne({ page: 'home', tenantId: TENANT_NAME });
    
    if (existing) {
      console.log(`Content already exists for tenant: ${TENANT_NAME}`);
      console.log('Updating existing content...');
      await Content.updateOne(
        { page: 'home', tenantId: TENANT_NAME },
        { ...ICTA_DEFAULT_CONTENT, updatedAt: new Date(), version: (existing.version || 0) + 1 }
      );
      console.log('Content updated successfully');
    } else {
      console.log(`Creating new content for tenant: ${TENANT_NAME}`);
      await Content.create({ ...ICTA_DEFAULT_CONTENT, tenantId: TENANT_NAME });
      console.log('Content created successfully');
    }
    
    console.log('\n Content seeded includes:');
    console.log(`- ${ICTA_DEFAULT_CONTENT.topNavLinks.length} top navigation links`);
    console.log(`- ${ICTA_DEFAULT_CONTENT.mainNavItems.length} main navigation items`);
    console.log(`- ${ICTA_DEFAULT_CONTENT.aboutItems.length} about items`);
    console.log(`- ${ICTA_DEFAULT_CONTENT.masterplanTabs.length} masterplan tabs`);
    console.log(`- ${ICTA_DEFAULT_CONTENT.news.items.length} news items`);
    console.log(`- ${ICTA_DEFAULT_CONTENT.quickLinks.length} quick links`);
    console.log(`- Footer with ${ICTA_DEFAULT_CONTENT.footer.quickLinks.length} quick links`);
    
    await mongoose.disconnect();
    console.log('\nSeeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedContent();*/
/*module.exports = {
  page: "home",
  published: true,
  version: 1,
  updatedBy: "system",
  navigation: [
    { name: "Home", href: "/", icon: "home" },
    { name: "About", href: "/about", icon: "info" },
    { name: "Research", href: "/research", icon: "science" },
    { name: "Contact", href: "/contact", icon: "mail" }
  ],
  hero: {
    announcementBadge: "New Report",
    announcementText: "Read our latest insights on carbon markets",
    headline: "Advancing Policy for",
    highlightedText: "Sustainable Landscapes",
    subtext: "We bridge the gap between global environmental policy and local conservation practice through rigorous research, strategic advisory, and actionable intelligence.",
    primaryButtonText: "Explore Our Work",
    secondaryButtonText: "Contact Us",
    features: ["Research", "Advisory", "Implementation"],
    backgroundImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format"
  },
  about: {
    badge: "About LIS",
    title: "Think Tank for a Sustainable Future",
    description1: "Landscapes Integrity Solutions (LIS) is an independent think tank dedicated to advancing policy and governance for sustainable landscapes. We combine cutting-edge research with practical implementation strategies to address complex environmental challenges.",
    description2: "Our multidisciplinary team of scientists, policy experts, and development practitioners works across sectors to deliver evidence-based solutions that balance ecological integrity with human well-being.",
    stats: [
      { number: "12+", label: "Countries" },
      { number: "35", label: "Publications" },
      { number: "50+", label: "Partners" }
    ],
    features: [
      { icon: "verified", title: "Evidence-based", description: "Rigorous research underpins all our work." },
      { icon: "groups", title: "Collaborative", description: "We partner with governments, NGOs, and private sector." },
      { icon: "public", title: "Global Reach", description: "Projects across Africa, Asia, and Latin America." },
      { icon: "eco", title: "Sustainability Focus", description: "Long-term solutions for people and nature." }
    ],
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format"
  },
  areas: [
    {
      icon: "forest",
      title: "Forest Governance",
      description: "Strengthening policies and institutions for sustainable forest management and deforestation-free supply chains.",
      link: "/research"
    },
    {
      icon: "water",
      title: "Water Security",
      description: "Integrated water resource management, watershed restoration, and climate-resilient water governance.",
      link: "/research"
    },
    {
      icon: "agriculture",
      title: "Sustainable Agriculture",
      description: "Promoting regenerative practices, agroecology, and market-based incentives for smallholders.",
      link: "/research"
    },
    {
      icon: "carbon",
      title: "Carbon & Climate",
      description: "Advising on carbon markets, NDC implementation, and nature-based climate solutions.",
      link: "/research"
    }
  ],
  partners: {
    badge: "Our Network",
    title: "Trusted by Leading Organizations",
    description: "We collaborate with a diverse range of partners to scale impact and drive systemic change.",
    categories: [
      "International NGOs",
      "Government Agencies",
      "Private Sector",
      "Research Institutions"
    ],
    logos: [
      { icon: "public", name: "UNDP", logo: "" },
      { icon: "eco", name: "WWF", logo: "" },
      { icon: "forest", name: "Rainforest Alliance", logo: "" },
      { icon: "science", name: "CIFOR", logo: "" },
      { icon: "corporate", name: "Unilever", logo: "" },
      { icon: "agriculture", name: "IFAD", logo: "" }
    ]
  },
  research: [
    {
      category: "Policy Brief",
      date: "Jan 2025",
      title: "Carbon Market Integrity: Lessons from Jurisdictional REDD+",
      description: "This analysis examines the challenges and opportunities for ensuring high-integrity carbon credits from forest landscapes.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format",
      isFeatured: true,
      isNew: true,
      link: "/research/carbon-market-integrity"
    },
    {
      category: "Working Paper",
      date: "Nov 2024",
      title: "Gender-Responsive Land Governance",
      description: "Exploring how inclusive land rights policies can enhance tenure security and climate resilience for women.",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format",
      isFeatured: false,
      isNew: false,
      link: "/research/gender-land-governance"
    },
    {
      category: "Case Study",
      date: "Aug 2024",
      title: "Restoring Peatlands in Indonesia: A Multi-Stakeholder Approach",
      description: "A deep dive into successful peatland restoration initiatives that combine community engagement with policy innovation.",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2074&auto=format",
      isFeatured: false,
      isNew: false,
      link: "/research/peatland-restoration"
    }
  ],
  advisory: [
    {
      icon: "analytics",
      title: "Strategic Intelligence",
      description: "Tailored analysis of policy landscapes, market trends, and regulatory shifts."
    },
    {
      icon: "handshake",
      title: "Multi-Stakeholder Engagement",
      description: "Facilitation of dialogues and partnerships across government, business, and civil society."
    },
    {
      icon: "assessment",
      title: "Impact Evaluation",
      description: "Rigorous assessment of programs and policies using quantitative and qualitative methods."
    },
    {
      icon: "school",
      title: "Capacity Building",
      description: "Customized training and technical assistance for institutions and practitioners."
    }
  ],
  testimonials: [
    {
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      name: "Dr. Jane Mwangi",
      handle: "Director, Ministry of Environment, Kenya",
      date: "March 2025",
      quote: "LIS provided critical insights that shaped our national climate action plan. Their team's expertise and dedication are unparalleled."
    },
    {
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Carlos Rodriguez",
      handle: "Sustainability Lead, Global Forestry Corp",
      date: "December 2024",
      quote: "The advisory services from LIS helped us navigate complex regulatory environments and achieve our deforestation-free commitments."
    },
    {
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      name: "Dr. Amara Singh",
      handle: "Research Fellow, World Resources Institute",
      date: "October 2024",
      quote: "LIS's research on jurisdictional approaches is a game-changer. Their rigorous methodology and policy relevance are exceptional."
    }
  ],
  contact: {
    sectionTitle: {
      text1: "Get in Touch",
      text2: "Let's Collaborate",
      text3: "We are always eager to connect with partners, researchers, and change-makers."
    },
    form: {
      nameLabel: "Full Name",
      namePlaceholder: "Your name",
      emailLabel: "Email Address",
      emailPlaceholder: "you@example.com",
      messageLabel: "Message",
      messagePlaceholder: "Tell us about your inquiry or project...",
      submitText: "Send Message"
    }
  },
  cta: {
    title: "Ready to drive sustainable change?",
    description: "Join dozens of organizations leveraging LIS intelligence to achieve measurable landscape impact.",
    primaryButtonText: "Request an Advisory",
    secondaryButtonText: "Contact Our Team"
  },
  footer: {
    description: "Landscapes Integrity Solutions (LIS) is an independent think tank advancing policy for sustainable landscapes. We translate complex environmental data into actionable governance frameworks.",
    socialLinks: [
      { icon: "linkedin", href: "https://linkedin.com/company/lis" },
      { icon: "twitter", href: "https://twitter.com/lis_thinktank" },
      { icon: "mail", href: "mailto:info@lis.org" }
    ],
    quickLinks: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Research", href: "/research" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" }
    ],
    contact: {
      address: "123 Earth Avenue, Nairobi, Kenya",
      email: "info@lis.org",
      phone: "+254 20 123 4567"
    },
    copyright: "© 2026 Landscapes Integrity Solutions (LIS). All Rights Reserved.",
    legalLinks: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Use", href: "/terms" },
      { name: "Accessibility", href: "/accessibility" }
    ]
  }
};*/