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
    
    console.log(`Connected to database: ${TENANT_DB_NAME}`);

    // Get the Content model for this connection
    const Content = connection.model('Content', ContentModel.schema);
    
    // Delete existing content
    const deleted = await Content.deleteMany({ tenantId: TENANT_DB_NAME, page: 'home' });
    console.log(`Deleted ${deleted.deletedCount} existing home content documents`);
    
    // Insert new content
    const result = await Content.create(ICTA_FULL_CONTENT);
    console.log(' Seeded full ICT Authority content');
    console.log(` ID: ${result._id}`);
    console.log(` Tenant: ${TENANT_DB_NAME}`);
    
    // Verify the content
    const saved = await Content.findOne({ tenantId: TENANT_DB_NAME, page: 'home' }).lean();
    console.log('\nVerification:');
    console.log(`   aboutItems: ${saved.aboutItems?.length || 0} items`);
    console.log(`   masterplanTabs: ${saved.masterplanTabs?.length || 0} tabs`);
    console.log(`   news items: ${saved.news?.items?.length || 0} items`);
    console.log(`   quickLinks: ${saved.quickLinks?.length || 0} links`);
    console.log(`   topNavLinks: ${saved.topNavLinks?.length || 0} links`);
    console.log(`   mainNavItems: ${saved.mainNavItems?.length || 0} items`);
    
    if (saved.aboutItems?.length > 0 && saved.masterplanTabs?.length > 0) {
      console.log('\n All ICT Authority fields successfully saved to database!');
    } else {
      console.log('\n Warning: Some fields may not have been saved correctly');
    }
    
    console.log('\n Seeding completed!');
    
  } catch (error) {
    console.error(' Seeding failed:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

seedContent();
