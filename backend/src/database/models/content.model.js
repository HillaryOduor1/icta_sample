import mongoose from 'mongoose';

// Navigation link schema
const navLinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  href: { type: String, required: true },
  icon: { type: String }
}, { _id: false });

// Hero section schema
const heroSchema = new mongoose.Schema({
  badge: { type: String },
  headline: { type: String },
  highlightedText: { type: String },
  headlineEnd: { type: String },
  description: { type: String },
  primaryButtonText: { type: String },
  secondaryButtonText: { type: String },
  backgroundImage: { type: String },
  announcementBadge: { type: String },
  announcementText: { type: String },
  subtext: { type: String },
  features: [{ type: String }]
}, { _id: false });

// About section schema
const aboutSchema = new mongoose.Schema({
  badge: { type: String },
  title: { type: String },
  description1: { type: String },
  description2: { type: String },
  stats: [{
    number: String,
    label: String
  }],
  features: [{
    icon: String,
    title: String,
    description: String
  }],
  image: { type: String }
}, { _id: false });

// About Item schema (for the 4 cards in About section)
const aboutItemSchema = new mongoose.Schema({
  icon: { type: String },
  title: { type: String },
  description: { type: String },
  link: { type: String }
}, { _id: false });

// Masterplan Tab Item schema
const masterplanItemSchema = new mongoose.Schema({
  icon: { type: String },
  title: { type: String },
  description: { type: String }
}, { _id: false });

// Masterplan Tab schema
const masterplanTabSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String },
  description: { type: String },
  ctaLink: { type: String },
  ctaText: { type: String },
  items: [masterplanItemSchema]
}, { _id: false });

// News Item schema
const newsItemSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String },
  description: { type: String },
  image: { type: String },
  link: { type: String },
  date: { type: String }
}, { _id: false });

// News section schema
const newsSchema = new mongoose.Schema({
  badge: { type: String },
  title: { type: String },
  description: { type: String },
  items: [newsItemSchema]
}, { _id: false });

// Quick Link schema
const quickLinkSchema = new mongoose.Schema({
  title: { type: String },
  href: { type: String },
  icon: { type: String },
  alt: { type: String }
}, { _id: false });

// Top Nav Link schema
const topNavLinkSchema = new mongoose.Schema({
  label: { type: String },
  href: { type: String },
  icon: { type: String },
  external: { type: Boolean, default: false }
}, { _id: false });

// Dropdown Item schema for main navigation
const dropdownItemSchema = new mongoose.Schema({
  label: { type: String },
  href: { type: String },
  external: { type: Boolean, default: false }
}, { _id: false });

// Main Nav Item schema
const mainNavItemSchema = new mongoose.Schema({
  label: { type: String },
  href: { type: String },
  external: { type: Boolean, default: false },
  dropdown: [dropdownItemSchema]
}, { _id: false });

// Area schema (for thematic areas)
const areaSchema = new mongoose.Schema({
  icon: { type: String },
  title: { type: String },
  description: { type: String },
  link: { type: String }
}, { _id: false });

// Partners section schema
const partnersSchema = new mongoose.Schema({
  badge: { type: String },
  title: { type: String },
  description: { type: String },
  categories: [{ type: String }],
  logos: [{
    icon: String,
    name: String,
    logo: String
  }]
}, { _id: false });

// Research item schema
const researchItemSchema = new mongoose.Schema({
  category: { type: String },
  date: { type: String },
  title: { type: String },
  description: { type: String },
  image: { type: String },
  isNew: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  link: { type: String }
}, { _id: false });

// Advisory item schema
const advisoryItemSchema = new mongoose.Schema({
  icon: { type: String },
  title: { type: String },
  description: { type: String }
}, { _id: false });

// Testimonial schema
const testimonialSchema = new mongoose.Schema({
  image: { type: String },
  name: { type: String },
  handle: { type: String },
  date: { type: String },
  quote: { type: String }
}, { _id: false });

// Contact section schema
const contactSchema = new mongoose.Schema({
  sectionTitle: {
    text1: String,
    text2: String,
    text3: String
  },
  form: {
    nameLabel: String,
    namePlaceholder: String,
    emailLabel: String,
    emailPlaceholder: String,
    messageLabel: String,
    messagePlaceholder: String,
    submitText: String
  }
}, { _id: false });

// CTA section schema
const ctaSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  primaryButtonText: { type: String },
  secondaryButtonText: { type: String }
}, { _id: false });

// Footer schema
const footerSchema = new mongoose.Schema({
  description: { type: String },
  quickLinks: [{
    name: String,
    href: String
  }],
  affiliatedSites: [{
    name: String,
    href: String
  }],
  resources: [{
    name: String,
    href: String
  }],
  ictaLinks: [{
    name: String,
    href: String
  }],
  contact: {
    address: String,
    email: String,
    phone: String
  },
  socialLinks: [{
    icon: String,
    href: String
  }],
  copyright: { type: String },
  legalLinks: [{
    name: String,
    href: String
  }]
}, { _id: false });

// Legal page schema (Privacy, Terms, Accessibility)
const legalSectionSchema = new mongoose.Schema({
  heading: String,
  content: String
}, { _id: false });

const legalPageSchema = new mongoose.Schema({
  title: { type: String },
  lastUpdated: { type: String },
  effectiveDate: { type: String },
  sections: [legalSectionSchema],
  contactEmail: { type: String },
  contactPhone: { type: String },
  contactAddress: { type: String }
}, { _id: false });

// Theme schema
const themeSchema = new mongoose.Schema({
  light: {
    bg: String,
    surface: String,
    border: String,
    text: String,
    muted: String,
    accent: String,
    primary: String,
    primaryForeground: String
  },
  dark: {
    bg: String,
    surface: String,
    border: String,
    text: String,
    muted: String,
    accent: String,
    primary: String,
    primaryForeground: String
  },
  typography: {
    fontFamily: String,
    headingWeight: String,
    bodyWeight: String,
    textScale: Number,
    textAlign: String
  },
  spacing: {
    spacingUnit: String,
    radius: String,
    shadowIntensity: String
  }
}, { _id: false });

// Main content schema
const contentSchema = new mongoose.Schema({
  page: { 
    type: String, 
    enum: ['home', 'about', 'research', 'contact', 'privacy', 'terms', 'accessibility'], 
    required: true, 
    index: true 
  },
  tenantId: { type: String, required: true, index: true },
  published: { type: Boolean, default: true },
  version: { type: Number, default: 1 },
  updatedBy: { type: String, default: 'system' },
  userId: { type: String },
  username: { type: String },
  
  // Standard sections
  navigation: [navLinkSchema],
  hero: heroSchema,
  about: aboutSchema,
  areas: [areaSchema],
  partners: partnersSchema,
  research: [researchItemSchema],
  advisory: [advisoryItemSchema],
  testimonials: [testimonialSchema],
  contact: contactSchema,
  cta: ctaSchema,
  footer: footerSchema,
  privacyPolicy: legalPageSchema,
  termsOfUse: legalPageSchema,
  accessibility: legalPageSchema,
  theme: themeSchema,
  
  // ICT Authority specific sections
  aboutItems: [aboutItemSchema],
  masterplanTabs: [masterplanTabSchema],
  news: newsSchema,
  quickLinks: [quickLinkSchema],
  topNavLinks: [topNavLinkSchema],
  mainNavItems: [mainNavItemSchema]
}, { timestamps: true });

export const ContentModel = mongoose.model('Content', contentSchema);
/*import mongoose from 'mongoose';

// Navigation link schema
const navLinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  href: { type: String, required: true },
  icon: { type: String }
}, { _id: false });

// Hero section schema
const heroSchema = new mongoose.Schema({
  badge: { type: String },
  headline: { type: String },
  highlightedText: { type: String },
  headlineEnd: { type: String },
  description: { type: String },
  primaryButtonText: { type: String },
  secondaryButtonText: { type: String },
  backgroundImage: { type: String },
  announcementBadge: { type: String },
  announcementText: { type: String },
  subtext: { type: String },
  features: [{ type: String }]
}, { _id: false });

// About section schema
const aboutSchema = new mongoose.Schema({
  badge: { type: String },
  title: { type: String },
  description1: { type: String },
  description2: { type: String },
  stats: [{
    number: String,
    label: String
  }],
  features: [{
    icon: String,
    title: String,
    description: String
  }],
  image: { type: String }
}, { _id: false });

// Area schema (for thematic areas)
const areaSchema = new mongoose.Schema({
  icon: { type: String },
  title: { type: String },
  description: { type: String },
  link: { type: String }
}, { _id: false });

// Partners section schema
const partnersSchema = new mongoose.Schema({
  badge: { type: String },
  title: { type: String },
  description: { type: String },
  categories: [{ type: String }],
  logos: [{
    icon: String,
    name: String,
    logo: String
  }]
}, { _id: false });

// Research item schema
const researchItemSchema = new mongoose.Schema({
  category: { type: String },
  date: { type: String },
  title: { type: String },
  description: { type: String },
  image: { type: String },
  isNew: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  link: { type: String }
}, { _id: false });

// Advisory item schema
const advisoryItemSchema = new mongoose.Schema({
  icon: { type: String },
  title: { type: String },
  description: { type: String }
}, { _id: false });

// Testimonial schema
const testimonialSchema = new mongoose.Schema({
  image: { type: String },
  name: { type: String },
  handle: { type: String },
  date: { type: String },
  quote: { type: String }
}, { _id: false });

// Contact section schema
const contactSchema = new mongoose.Schema({
  sectionTitle: {
    text1: String,
    text2: String,
    text3: String
  },
  form: {
    nameLabel: String,
    namePlaceholder: String,
    emailLabel: String,
    emailPlaceholder: String,
    messageLabel: String,
    messagePlaceholder: String,
    submitText: String
  }
}, { _id: false });

// CTA section schema
const ctaSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  primaryButtonText: { type: String },
  secondaryButtonText: { type: String }
}, { _id: false });

// Footer schema
const footerSchema = new mongoose.Schema({
  description: { type: String },
  quickLinks: [{
    name: String,
    href: String
  }],
  contact: {
    address: String,
    email: String,
    phone: String
  },
  socialLinks: [{
    icon: String,
    href: String
  }],
  copyright: { type: String },
  legalLinks: [{
    name: String,
    href: String
  }]
}, { _id: false });

// Legal page schema (Privacy, Terms, Accessibility)
const legalSectionSchema = new mongoose.Schema({
  heading: String,
  content: String
}, { _id: false });

const legalPageSchema = new mongoose.Schema({
  title: { type: String },
  lastUpdated: { type: String },
  effectiveDate: { type: String },
  sections: [legalSectionSchema],
  contactEmail: { type: String },
  contactPhone: { type: String },
  contactAddress: { type: String }
}, { _id: false });

// Theme schema
const themeSchema = new mongoose.Schema({
  light: {
    bg: String,
    surface: String,
    border: String,
    text: String,
    muted: String,
    accent: String,
    primary: String,
    primaryForeground: String
  },
  dark: {
    bg: String,
    surface: String,
    border: String,
    text: String,
    muted: String,
    accent: String,
    primary: String,
    primaryForeground: String
  },
  typography: {
    fontFamily: String,
    headingWeight: String,
    bodyWeight: String,
    textScale: Number,
    textAlign: String
  },
  spacing: {
    spacingUnit: String,
    radius: String,
    shadowIntensity: String
  }
}, { _id: false });

// Main content schema
const contentSchema = new mongoose.Schema({
  page: { 
    type: String, 
    enum: ['home', 'about', 'research', 'contact', 'privacy', 'terms', 'accessibility'], 
    required: true, 
    index: true 
  },
  tenantId: { type: String, required: true, index: true },
  published: { type: Boolean, default: true },
  version: { type: Number, default: 1 },
  updatedBy: { type: String, default: 'system' },
  userId: { type: String },
  username: { type: String },
  
  // Content sections
  navigation: [navLinkSchema],
  hero: heroSchema,
  about: aboutSchema,
  areas: [areaSchema],
  partners: partnersSchema,
  research: [researchItemSchema],
  advisory: [advisoryItemSchema],
  testimonials: [testimonialSchema],
  contact: contactSchema,
  cta: ctaSchema,
  footer: footerSchema,
  privacyPolicy: legalPageSchema,
  termsOfUse: legalPageSchema,
  accessibility: legalPageSchema,
  theme: themeSchema,
  
  // News section (for ICT Authority specific content)
  news: {
    badge: String,
    title: String,
    description: String,
    items: [{
      id: Number,
      title: String,
      description: String,
      image: String,
      link: String,
      date: String
    }]
  },
  
  // Quick Links section
  quickLinks: [{
    title: String,
    href: String,
    icon: String,
    alt: String
  }],
  
  // Top navigation links (red bar)
  topNavLinks: [{
    label: String,
    href: String,
    icon: String,
    external: Boolean
  }],
  
  // Main navigation items with dropdowns
  mainNavItems: [{
    label: String,
    href: String,
    external: Boolean,
    dropdown: [{
      label: String,
      href: String,
      external: Boolean
    }]
  }]
}, { timestamps: true });

export const ContentModel = mongoose.model('Content', contentSchema);*/


/*
import mongoose from 'mongoose';

// Sub‑schemas (as in your original, but trimmed for brevity – add all as needed)
const navLinkSchema = new mongoose.Schema({ name: String, href: String, icon: String }, { _id: false });
const heroSchema = new mongoose.Schema({ announcementBadge: String, headline: String, subtext: String, backgroundImage: String }, { _id: false });
const footerSchema = new mongoose.Schema({ description: String, copyright: String }, { _id: false });
// ... add all other sub‑schemas (about, areas, partners, research, etc.) from your original Content.js

const contentSchema = new mongoose.Schema({
  page: { type: String, enum: ['home', 'about', 'research', 'contact'], required: true, index: true },
  tenantId: { type: String, required: true, index: true },
  navigation: [navLinkSchema],
  hero: heroSchema,
  about: mongoose.Schema.Types.Mixed,
  areas: [mongoose.Schema.Types.Mixed],
  partners: mongoose.Schema.Types.Mixed,
  research: [mongoose.Schema.Types.Mixed],
  advisory: [mongoose.Schema.Types.Mixed],
  pricing: [mongoose.Schema.Types.Mixed],
  testimonials: [mongoose.Schema.Types.Mixed],
  contact: mongoose.Schema.Types.Mixed,
  cta: mongoose.Schema.Types.Mixed,
  footer: footerSchema,
  privacyPolicy: mongoose.Schema.Types.Mixed,
  termsOfUse: mongoose.Schema.Types.Mixed,
  accessibility: mongoose.Schema.Types.Mixed,
  metadata: mongoose.Schema.Types.Mixed,
  published: { type: Boolean, default: true },
  version: { type: Number, default: 1 },
  updatedBy: { type: String, default: 'system' },
}, { timestamps: true });

export const ContentModel = mongoose.model('Content', contentSchema);*/