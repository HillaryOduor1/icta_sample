// backend/admin/src/components/ContentManager.jsx
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Plus, Trash2, Check, ChevronDown, ChevronRight } from 'lucide-react';

const API_BASE = '/api/v1';

// DEFAULT CONTENT (only used as fallback when no content in DB) 
const DEFAULT_CONTENT = {
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
    backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCaw5m81nNM0MZpSeCDSNMR8jtfNYnp9g_sDz_8asKYKGnthRVAskslJIAjiTmbaHXZ-vuirL6iauAcncqAt2woss8Pecc8hsmRThlmME0jN_5qDagGnFTfiLbp_Y4Sx7RcnMmq8qrWjUUOJO9pG6aZIEuGw-SvSgEoJcX3KrjoAOVTpUcVGUDF4-f--biRylHhvozDmzE6pQWv7ZzideKNjDPIdBVCPFQgaRA2Ih0i3203IltxKnEwHLmMXevAasWpWNy8mdawQ",
    announcementBadge: "",
    announcementText: "",
    subtext: "",
    features: []
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
  
  // About Items (4 cards)
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
  },
  
  areas: [],
  partners: { badge: "", title: "", description: "", categories: [], logos: [] },
  research: [],
  advisory: [],
  privacyPolicy: { title: "", lastUpdated: "", sections: [], contactEmail: "", contactPhone: "", contactAddress: "" },
  termsOfUse: { title: "", effectiveDate: "", sections: [], contactEmail: "" },
  accessibility: { title: "", lastUpdated: "", sections: [], contactEmail: "", contactPhone: "", contactAddress: "" },
  theme: {
    light: { bg: '#f6f8f7', surface: '#FFFFFF', border: '#e7f3ed', text: '#0d1b14', muted: '#4a5a52', accent: '#11d473', primary: '#11d473', primaryForeground: '#0d1b14' },
    dark: { bg: '#102219', surface: '#1a2e22', border: '#2a3f32', text: '#FFFFFF', muted: '#9fb0a5', accent: '#11d473', primary: '#11d473', primaryForeground: '#0d1b14' },
    typography: { fontFamily: 'Public Sans, sans-serif', headingWeight: '700', bodyWeight: '400', textScale: 1, textAlign: 'left' },
    spacing: { spacingUnit: '0.5rem', radius: '0.75rem', shadowIntensity: '1' }
  }
};

//HELPER FUNCTIONS 
function Field({ label, value, onChange, multiline, placeholder, type = "text" }) {
  return (
    <div className="mb-3">
      {label && <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">{label}</label>}
      {multiline ? (
        <textarea
          rows={3}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm resize-none bg-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm bg-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
        />
      )}
    </div>
  );
}

function ImageField({ label, value, onChange, placeholder }) {
  return (
    <div className="mb-3">
      <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter image URL"}
        className="w-full px-3 py-2 text-sm bg-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
      />
      {value && <img src={value} alt="Preview" className="mt-2 h-20 object-cover rounded" />}
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  const [color, setColor] = React.useState(value || '#11d473');
  const [manual, setManual] = React.useState(value || '#11d473');

  React.useEffect(() => {
    setColor(value || '#11d473');
    setManual(value || '#11d473');
  }, [value]);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    setManual(newColor);
    onChange(newColor);
  };

  const handleManualChange = (e) => {
    const newColor = e.target.value;
    setManual(newColor);
    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
      setColor(newColor);
      onChange(newColor);
    }
  };

  return (
    <div className="mb-3">
      <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="w-10 h-10 rounded border border-border cursor-pointer bg-surface"
          />
        </div>
        <input
          type="text"
          value={manual}
          onChange={handleManualChange}
          placeholder="#000000"
          className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent font-mono"
        />
      </div>
    </div>
  );
}

// EDITOR COMPONENTS

function TopNavLinksEditor({ links, onChange }) {
  const safeLinks = Array.isArray(links) && links.length ? links : DEFAULT_CONTENT.topNavLinks;
  
  const updateLink = (idx, field, val) => {
    const newLinks = [...safeLinks];
    newLinks[idx] = { ...newLinks[idx], [field]: val };
    onChange(newLinks);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted mb-2">Top navigation bar links (red background)</p>
      {safeLinks.map((link, idx) => (
        <div key={idx} className="border border-border p-4 rounded mb-4">
          <div className="flex justify-between mb-3">
            <h4 className="font-bold">Link {idx+1}</h4>
            <button onClick={() => onChange(safeLinks.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600">
              <Trash2 size={16} />
            </button>
          </div>
          <Field label="Label" value={link.label || ''} onChange={(v) => updateLink(idx, 'label', v)} />
          <Field label="URL" value={link.href || ''} onChange={(v) => updateLink(idx, 'href', v)} />
          <Field label="Icon (optional)" value={link.icon || ''} onChange={(v) => updateLink(idx, 'icon', v)} />
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" checked={link.external || false} onChange={(e) => updateLink(idx, 'external', e.target.checked)} />
            <span className="text-sm">Open in new tab</span>
          </label>
        </div>
      ))}
      <button onClick={() => onChange([...safeLinks, { label: '', href: '', icon: '', external: true }])} className="w-full py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted hover:border-accent hover:text-accent">
        <Plus size={16} className="inline mr-1" /> Add Top Nav Link
      </button>
    </div>
  );
}

function MainNavItemsEditor({ items, onChange }) {
  const safeItems = Array.isArray(items) && items.length ? items : DEFAULT_CONTENT.mainNavItems;
  const [expandedItem, setExpandedItem] = useState(null);

  const updateItem = (idx, field, val) => {
    const newItems = [...safeItems];
    newItems[idx] = { ...newItems[idx], [field]: val };
    onChange(newItems);
  };

  const updateDropdown = (itemIdx, dropdownIdx, field, val) => {
    const newItems = [...safeItems];
    const dropdown = [...(newItems[itemIdx].dropdown || [])];
    dropdown[dropdownIdx] = { ...dropdown[dropdownIdx], [field]: val };
    newItems[itemIdx].dropdown = dropdown;
    onChange(newItems);
  };

  const addDropdownItem = (itemIdx) => {
    const newItems = [...safeItems];
    const dropdown = [...(newItems[itemIdx].dropdown || [])];
    dropdown.push({ label: '', href: '', external: true });
    newItems[itemIdx].dropdown = dropdown;
    onChange(newItems);
  };

  const removeDropdownItem = (itemIdx, dropdownIdx) => {
    const newItems = [...safeItems];
    const dropdown = [...(newItems[itemIdx].dropdown || [])];
    dropdown.splice(dropdownIdx, 1);
    newItems[itemIdx].dropdown = dropdown;
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted mb-2">Main navigation items (supports dropdowns)</p>
      {safeItems.map((item, idx) => (
        <div key={idx} className="border border-border rounded-lg mb-4 overflow-hidden">
          <div 
            className="flex justify-between items-center p-4 bg-surface-dark cursor-pointer hover:bg-accent/5"
            onClick={() => setExpandedItem(expandedItem === idx ? null : idx)}
          >
            <h4 className="font-bold">{item.label || `Item ${idx+1}`}</h4>
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onChange(safeItems.filter((_, i) => i !== idx)); }} 
                className="text-red-400 hover:text-red-600 p-1"
              >
                <Trash2 size={16} />
              </button>
              {expandedItem === idx ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          </div>
          {expandedItem === idx && (
            <div className="p-4 border-t border-border">
              <Field label="Label" value={item.label || ''} onChange={(v) => updateItem(idx, 'label', v)} />
              <Field label="URL (leave empty if dropdown)" value={item.href || ''} onChange={(v) => updateItem(idx, 'href', v)} />
              <label className="flex items-center gap-2 mb-3">
                <input type="checkbox" checked={item.external || false} onChange={(e) => updateItem(idx, 'external', e.target.checked)} />
                <span className="text-sm">Open in new tab</span>
              </label>
              
              <div className="mt-4">
                <h5 className="font-semibold text-sm mb-2">Dropdown Items</h5>
                {item.dropdown && item.dropdown.map((drop, dropIdx) => (
                  <div key={dropIdx} className="border border-border p-3 rounded mb-2 ml-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-muted">Item {dropIdx+1}</span>
                      <button onClick={() => removeDropdownItem(idx, dropIdx)} className="text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <Field label="Label" value={drop.label || ''} onChange={(v) => updateDropdown(idx, dropIdx, 'label', v)} />
                    <Field label="URL" value={drop.href || ''} onChange={(v) => updateDropdown(idx, dropIdx, 'href', v)} />
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={drop.external || false} onChange={(e) => updateDropdown(idx, dropIdx, 'external', e.target.checked)} />
                      <span className="text-sm">Open in new tab</span>
                    </label>
                  </div>
                ))}
                <button onClick={() => addDropdownItem(idx)} className="text-sm text-accent hover:underline mt-2 ml-4">
                  + Add Dropdown Item
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <button onClick={() => onChange([...safeItems, { label: '', href: '', external: true, dropdown: [] }])} className="w-full py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted hover:border-accent hover:text-accent">
        <Plus size={16} className="inline mr-1" /> Add Nav Item
      </button>
    </div>
  );
}

function HeroEditor({ hero, onChange }) {
  const safeHero = hero || DEFAULT_CONTENT.hero;
  
  return (
    <div className="space-y-4">
      <Field label="Badge" value={safeHero.badge || ''} onChange={(v) => onChange({ ...safeHero, badge: v })} />
      <Field label="Headline Start" value={safeHero.headline || ''} onChange={(v) => onChange({ ...safeHero, headline: v })} />
      <Field label="Highlighted Text" value={safeHero.highlightedText || ''} onChange={(v) => onChange({ ...safeHero, highlightedText: v })} />
      <Field label="Headline End" value={safeHero.headlineEnd || ''} onChange={(v) => onChange({ ...safeHero, headlineEnd: v })} />
      <Field label="Description" value={safeHero.description || ''} onChange={(v) => onChange({ ...safeHero, description: v })} multiline />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primary Button" value={safeHero.primaryButtonText || ''} onChange={(v) => onChange({ ...safeHero, primaryButtonText: v })} />
        <Field label="Secondary Button" value={safeHero.secondaryButtonText || ''} onChange={(v) => onChange({ ...safeHero, secondaryButtonText: v })} />
      </div>
      <ImageField label="Background Image URL" value={safeHero.backgroundImage || ''} onChange={(v) => onChange({ ...safeHero, backgroundImage: v })} />
    </div>
  );
}

function AboutEditor({ about, onChange }) {
  const safeAbout = about || DEFAULT_CONTENT.about;
  return (
    <div className="space-y-4">
      <Field label="Title" value={safeAbout.title || ''} onChange={(v) => onChange({ ...safeAbout, title: v })} />
      <Field label="Description" value={safeAbout.description1 || ''} onChange={(v) => onChange({ ...safeAbout, description1: v })} multiline />
    </div>
  );
}

function AboutItemsEditor({ items, onChange }) {
  const safeItems = Array.isArray(items) && items.length ? items : DEFAULT_CONTENT.aboutItems;
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">4 cards in the About section</p>
      {safeItems.map((item, idx) => (
        <div key={idx} className="border border-border p-4 rounded mb-4">
          <div className="flex justify-between mb-3">
            <h4 className="font-bold">Card {idx+1}</h4>
            <button onClick={() => onChange(safeItems.filter((_, i) => i !== idx))} className="text-red-400">
              <Trash2 size={16} />
            </button>
          </div>
          <ImageField label="Icon URL" value={item.icon || ''} onChange={(v) => { const newItems = [...safeItems]; newItems[idx] = { ...item, icon: v }; onChange(newItems); }} />
          <Field label="Title" value={item.title || ''} onChange={(v) => { const newItems = [...safeItems]; newItems[idx] = { ...item, title: v }; onChange(newItems); }} />
          <Field label="Description" value={item.description || ''} onChange={(v) => { const newItems = [...safeItems]; newItems[idx] = { ...item, description: v }; onChange(newItems); }} multiline />
          <Field label="Link URL" value={item.link || ''} onChange={(v) => { const newItems = [...safeItems]; newItems[idx] = { ...item, link: v }; onChange(newItems); }} />
        </div>
      ))}
    </div>
  );
}

function MasterplanTabsEditor({ tabs, onChange }) {
  const safeTabs = Array.isArray(tabs) && tabs.length ? tabs : DEFAULT_CONTENT.masterplanTabs;
  const [activeTab, setActiveTab] = useState(0);

  const updateTab = (idx, field, val) => {
    const newTabs = [...safeTabs];
    newTabs[idx] = { ...newTabs[idx], [field]: val };
    onChange(newTabs);
  };

  const updateItem = (tabIdx, itemIdx, field, val) => {
    const newTabs = [...safeTabs];
    const items = [...(newTabs[tabIdx].items || [])];
    items[itemIdx] = { ...items[itemIdx], [field]: val };
    newTabs[tabIdx].items = items;
    onChange(newTabs);
  };

  const addItem = (tabIdx) => {
    const newTabs = [...safeTabs];
    const items = [...(newTabs[tabIdx].items || [])];
    items.push({ icon: '', title: '', description: '' });
    newTabs[tabIdx].items = items;
    onChange(newTabs);
  };

  const removeItem = (tabIdx, itemIdx) => {
    const newTabs = [...safeTabs];
    const items = [...(newTabs[tabIdx].items || [])];
    items.splice(itemIdx, 1);
    newTabs[tabIdx].items = items;
    onChange(newTabs);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap mb-4">
        {safeTabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-3 py-1 rounded text-sm ${activeTab === idx ? 'bg-accent text-white' : 'bg-surface border border-border'}`}
          >
            {tab.title || `Tab ${idx+1}`}
          </button>
        ))}
        <button onClick={() => onChange([...safeTabs, { id: `tab_${Date.now()}`, title: '', description: '', ctaLink: '', ctaText: '', items: [] }])} className="px-3 py-1 rounded text-sm border border-dashed">
          + Add Tab
        </button>
      </div>
      
      {safeTabs[activeTab] && (
        <>
          <Field label="Tab Title" value={safeTabs[activeTab].title || ''} onChange={(v) => updateTab(activeTab, 'title', v)} />
          <Field label="Description" value={safeTabs[activeTab].description || ''} onChange={(v) => updateTab(activeTab, 'description', v)} multiline />
          <Field label="CTA Link" value={safeTabs[activeTab].ctaLink || ''} onChange={(v) => updateTab(activeTab, 'ctaLink', v)} />
          <Field label="CTA Text" value={safeTabs[activeTab].ctaText || ''} onChange={(v) => updateTab(activeTab, 'ctaText', v)} />
          
          <div className="border-t border-border my-4" />
          <h4 className="font-semibold">Tab Items</h4>
          {safeTabs[activeTab].items && safeTabs[activeTab].items.map((item, itemIdx) => (
            <div key={itemIdx} className="border border-border p-4 rounded mb-4">
              <div className="flex justify-between mb-3">
                <h5 className="font-bold">Item {itemIdx+1}</h5>
                <button onClick={() => removeItem(activeTab, itemIdx)} className="text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
              <ImageField label="Icon URL" value={item.icon || ''} onChange={(v) => updateItem(activeTab, itemIdx, 'icon', v)} />
              <Field label="Title" value={item.title || ''} onChange={(v) => updateItem(activeTab, itemIdx, 'title', v)} />
              <Field label="Description" value={item.description || ''} onChange={(v) => updateItem(activeTab, itemIdx, 'description', v)} multiline />
            </div>
          ))}
          <button onClick={() => addItem(activeTab)} className="w-full py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted hover:border-accent">
            <Plus size={16} className="inline mr-1" /> Add Item to Tab
          </button>
        </>
      )}
    </div>
  );
}

function NewsEditor({ news, onChange }) {
  const safe = news || DEFAULT_CONTENT.news;
  
  const updateItem = (idx, field, val) => {
    const newItems = [...(safe.items || [])];
    newItems[idx] = { ...newItems[idx], [field]: val };
    onChange({ ...safe, items: newItems });
  };

  return (
    <div className="space-y-4">
      <Field label="Section Title" value={safe.title || ''} onChange={(v) => onChange({ ...safe, title: v })} />
      <Field label="Section Description" value={safe.description || ''} onChange={(v) => onChange({ ...safe, description: v })} multiline />
      
      <div className="border-t border-border my-4" />
      <h4 className="font-semibold">News Items</h4>
      {safe.items && safe.items.map((item, idx) => (
        <div key={idx} className="border border-border p-4 rounded mb-4">
          <div className="flex justify-between mb-3">
            <h5 className="font-bold">Item {idx+1}</h5>
            <button onClick={() => onChange({ ...safe, items: safe.items.filter((_, i) => i !== idx) })} className="text-red-400">
              <Trash2 size={16} />
            </button>
          </div>
          <Field label="Title" value={item.title || ''} onChange={(v) => updateItem(idx, 'title', v)} />
          <Field label="Description" value={item.description || ''} onChange={(v) => updateItem(idx, 'description', v)} multiline />
          <ImageField label="Image URL" value={item.image || ''} onChange={(v) => updateItem(idx, 'image', v)} />
          <Field label="Link URL" value={item.link || ''} onChange={(v) => updateItem(idx, 'link', v)} />
        </div>
      ))}
      <button onClick={() => onChange({ ...safe, items: [...(safe.items || []), { id: Date.now(), title: '', description: '', image: '', link: '', date: '' }] })} className="w-full py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted hover:border-accent">
        <Plus size={16} className="inline mr-1" /> Add News Item
      </button>
    </div>
  );
}

function QuickLinksEditor({ links, onChange }) {
  const safeLinks = Array.isArray(links) && links.length ? links : DEFAULT_CONTENT.quickLinks;
  
  return (
    <div className="space-y-4">
      {safeLinks.map((link, idx) => (
        <div key={idx} className="border border-border p-4 rounded mb-4">
          <div className="flex justify-between mb-3">
            <h4 className="font-bold">Link {idx+1}</h4>
            <button onClick={() => onChange(safeLinks.filter((_, i) => i !== idx))} className="text-red-400">
              <Trash2 size={16} />
            </button>
          </div>
          <Field label="Title" value={link.title || ''} onChange={(v) => { const newLinks = [...safeLinks]; newLinks[idx] = { ...link, title: v }; onChange(newLinks); }} />
          <Field label="URL" value={link.href || ''} onChange={(v) => { const newLinks = [...safeLinks]; newLinks[idx] = { ...link, href: v }; onChange(newLinks); }} />
          <ImageField label="Icon URL" value={link.icon || ''} onChange={(v) => { const newLinks = [...safeLinks]; newLinks[idx] = { ...link, icon: v }; onChange(newLinks); }} />
          <Field label="Alt Text" value={link.alt || ''} onChange={(v) => { const newLinks = [...safeLinks]; newLinks[idx] = { ...link, alt: v }; onChange(newLinks); }} />
        </div>
      ))}
      <button onClick={() => onChange([...safeLinks, { title: '', href: '', icon: '', alt: '' }])} className="w-full py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted hover:border-accent">
        <Plus size={16} className="inline mr-1" /> Add Quick Link
      </button>
    </div>
  );
}

function FooterEditor({ footer, onChange }) {
  const safe = footer || DEFAULT_CONTENT.footer;
  
  const updateQuickLink = (idx, field, val) => {
    const newLinks = [...(safe.quickLinks || [])];
    newLinks[idx] = { ...newLinks[idx], [field]: val };
    onChange({ ...safe, quickLinks: newLinks });
  };

  const updateSocialLink = (idx, field, val) => {
    const newLinks = [...(safe.socialLinks || [])];
    newLinks[idx] = { ...newLinks[idx], [field]: val };
    onChange({ ...safe, socialLinks: newLinks });
  };

  return (
    <div className="space-y-4">
      <Field label="Copyright" value={safe.copyright || ''} onChange={(v) => onChange({ ...safe, copyright: v })} />
      
      <div className="border-t border-border my-4" />
      <h4 className="font-semibold">Quick Links</h4>
      {safe.quickLinks && safe.quickLinks.map((link, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <Field label="Name" value={link.name || ''} onChange={(v) => updateQuickLink(idx, 'name', v)} />
          <Field label="URL" value={link.href || ''} onChange={(v) => updateQuickLink(idx, 'href', v)} />
          <button onClick={() => onChange({ ...safe, quickLinks: safe.quickLinks.filter((_, i) => i !== idx) })} className="text-red-400 self-end mb-3">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button onClick={() => onChange({ ...safe, quickLinks: [...(safe.quickLinks || []), { name: '', href: '' }] })} className="text-sm text-accent hover:underline">
        + Add Quick Link
      </button>
      
      <div className="border-t border-border my-4" />
      <h4 className="font-semibold">Social Links</h4>
      {safe.socialLinks && safe.socialLinks.map((link, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <Field label="Icon" value={link.icon || ''} onChange={(v) => updateSocialLink(idx, 'icon', v)} />
          <Field label="URL" value={link.href || ''} onChange={(v) => updateSocialLink(idx, 'href', v)} />
          <button onClick={() => onChange({ ...safe, socialLinks: safe.socialLinks.filter((_, i) => i !== idx) })} className="text-red-400 self-end mb-3">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button onClick={() => onChange({ ...safe, socialLinks: [...(safe.socialLinks || []), { icon: '', href: '' }] })} className="text-sm text-accent hover:underline">
        + Add Social Link
      </button>
    </div>
  );
}

function LegalEditor({ data, onChange, title }) {
  const safeData = data || { title: "", lastUpdated: "", sections: [], contactEmail: "", contactPhone: "", contactAddress: "" };
  const sections = safeData.sections || [];

  const updateSection = (idx, field, value) => {
    const newSections = [...sections];
    newSections[idx] = { ...newSections[idx], [field]: value };
    onChange({ ...safeData, sections: newSections });
  };

  const addSection = () => {
    onChange({ ...safeData, sections: [...sections, { heading: '', content: '' }] });
  };

  const removeSection = (idx) => {
    onChange({ ...safeData, sections: sections.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4">
      <Field label="Title" value={safeData.title || ''} onChange={(v) => onChange({ ...safeData, title: v })} />
      <Field label="Last Updated / Effective Date" value={safeData.lastUpdated || safeData.effectiveDate || ''} onChange={(v) => onChange({ ...safeData, lastUpdated: v, effectiveDate: v })} />
      <div className="border-t border-border my-4" />
      <h3 className="font-semibold text-lg">Sections</h3>
      {sections.map((sec, idx) => (
        <div key={idx} className="border border-border rounded-lg p-4 relative mb-4">
          <button onClick={() => removeSection(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
            <Trash2 size={16} />
          </button>
          <Field label="Heading" value={sec.heading || ''} onChange={(v) => updateSection(idx, 'heading', v)} />
          <Field label="Content" value={sec.content || ''} onChange={(v) => updateSection(idx, 'content', v)} multiline />
        </div>
      ))}
      <button onClick={addSection} className="w-full py-2 rounded-lg border-2 border-dashed border-border text-sm text-muted hover:border-accent hover:text-accent">
        <Plus size={16} className="inline mr-1" /> Add Section
      </button>
      <div className="border-t border-border my-4" />
      <Field label="Contact Email" value={safeData.contactEmail || ''} onChange={(v) => onChange({ ...safeData, contactEmail: v })} />
      <Field label="Contact Phone" value={safeData.contactPhone || ''} onChange={(v) => onChange({ ...safeData, contactPhone: v })} />
      <Field label="Contact Address" value={safeData.contactAddress || ''} onChange={(v) => onChange({ ...safeData, contactAddress: v })} />
    </div>
  );
}

function ThemeEditor({ theme, onChange }) {
  const safe = theme || DEFAULT_CONTENT.theme;
  const updateLight = (key, val) => onChange({ ...safe, light: { ...safe.light, [key]: val } });
  const updateDark = (key, val) => onChange({ ...safe, dark: { ...safe.dark, [key]: val } });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">Light Mode Colors</h3>
        <ColorField label="Background" value={safe.light?.bg || '#f6f8f7'} onChange={(v) => updateLight('bg', v)} />
        <ColorField label="Surface (cards)" value={safe.light?.surface || '#FFFFFF'} onChange={(v) => updateLight('surface', v)} />
        <ColorField label="Text" value={safe.light?.text || '#0d1b14'} onChange={(v) => updateLight('text', v)} />
        <ColorField label="Primary/Accent" value={safe.light?.primary || '#11d473'} onChange={(v) => updateLight('primary', v)} />
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">Dark Mode Colors</h3>
        <ColorField label="Background" value={safe.dark?.bg || '#102219'} onChange={(v) => updateDark('bg', v)} />
        <ColorField label="Surface" value={safe.dark?.surface || '#1a2e22'} onChange={(v) => updateDark('surface', v)} />
        <ColorField label="Text" value={safe.dark?.text || '#FFFFFF'} onChange={(v) => updateDark('text', v)} />
        <ColorField label="Primary/Accent" value={safe.dark?.primary || '#11d473'} onChange={(v) => updateDark('primary', v)} />
      </div>
    </div>
  );
}

// MAIN COMPONENT 
export default function ContentManager() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [error, setError] = useState(null);

  const loadContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const tenant = import.meta.env.VITE_TENANT_NAME;
      console.log('Loading content for tenant:', tenant);
      
      const res = await fetch(`${API_BASE}/content?tenant=${tenant}`, {
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error(`Failed to load content: ${res.status}`);
      
      const data = await res.json();
      let homeContent = null;
      
      if (data && data.data) {
        if (Array.isArray(data.data)) {
          const found = data.data.find(c => c.page === 'home');
          homeContent = found?.data || found;
        } else if (data.data.page === 'home') {
          homeContent = data.data.data || data.data;
        }
      } else if (data && data.page === 'home') {
        homeContent = data;
      }
      
      if (homeContent && Object.keys(homeContent).length > 1) {
        const mergedContent = {
          ...DEFAULT_CONTENT,
          ...homeContent,
          hero: { ...DEFAULT_CONTENT.hero, ...(homeContent.hero || {}) },
          about: { ...DEFAULT_CONTENT.about, ...(homeContent.about || {}) },
          footer: { ...DEFAULT_CONTENT.footer, ...(homeContent.footer || {}) },
        };
        setContent(mergedContent);
      } else {
        setContent(DEFAULT_CONTENT);
      }
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Could not load content from server: ' + err.message);
      setContent(DEFAULT_CONTENT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const tenant = import.meta.env.VITE_TENANT_NAME;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const payload = {
        page: "home",
        tenantId: tenant,
        published: true,
        version: (content.version || 1) + 1,
        updatedBy: user.email || user.name || "admin",
        userId: user.id || user.sub,
        username: user.email || user.name || "admin",
        topNavLinks: content.topNavLinks,
        mainNavItems: content.mainNavItems,
        hero: content.hero,
        about: content.about,
        aboutItems: content.aboutItems,
        masterplanTabs: content.masterplanTabs,
        news: content.news,
        quickLinks: content.quickLinks,
        footer: content.footer,
        testimonials: content.testimonials,
        cta: content.cta,
        contact: content.contact,
        privacyPolicy: content.privacyPolicy,
        termsOfUse: content.termsOfUse,
        accessibility: content.accessibility,
        theme: content.theme
      };
      
      const res = await fetch(`${API_BASE}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      
      setSaved(true);
      window.dispatchEvent(new Event("content-updated"));
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Save error:', err);
      setError('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (key, value) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const sectionHelperText = {
    topNavLinks: 'Edit the top red navigation bar links',
    mainNavItems: 'Edit the main navigation menu with dropdown support',
    hero: 'Edit the main hero section – badge, headline, buttons, and background image',
    about: 'Edit the About section title and description',
    aboutItems: 'Edit the 4 about cards with icons, titles, and descriptions',
    masterplanTabs: 'Edit the Masterplan tabs (National Digital Masterplan, For Citizens, Partners)',
    news: 'Edit the News & Events section',
    quickLinks: 'Edit the quick links section with icons',
    footer: 'Edit footer content – copyright, quick links, and social links',
    privacyPolicy: 'Edit the Privacy Policy page',
    termsOfUse: 'Edit the Terms of Use page',
    accessibility: 'Edit the Accessibility Statement page',
    theme: 'Customize colors for light and dark mode'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="animate-spin mr-2" size={20} />
        <span className="text-muted">Loading content...</span>
      </div>
    );
  }

  if (!content) return <div className="text-center py-12">No content available</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Manager</h2>
          <p className="text-sm text-muted">{sectionHelperText[activeSection] || 'Edit homepage content'}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-white transition-all ${
            saved ? 'bg-green-500' : 'bg-accent hover:bg-accent/80'
          } disabled:opacity-50`}
        >
          {saving ? <RefreshCw className="animate-spin" size={16} /> : saved ? <Check size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </div>
      {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-1">
          {[
            'topNavLinks', 'mainNavItems', 'hero', 'about', 'aboutItems', 
            'masterplanTabs', 'news', 'quickLinks', 'footer', 'theme',
            'privacyPolicy', 'termsOfUse', 'accessibility'
          ].map(sectionKey => {
            let displayName = sectionKey;
            if (sectionKey === 'topNavLinks') displayName = 'Top Navigation';
            else if (sectionKey === 'mainNavItems') displayName = 'Main Navigation';
            else if (sectionKey === 'aboutItems') displayName = 'About Cards';
            else if (sectionKey === 'masterplanTabs') displayName = 'Masterplan Tabs';
            else if (sectionKey === 'quickLinks') displayName = 'Quick Links';
            else if (sectionKey === 'privacyPolicy') displayName = 'Privacy Policy';
            else if (sectionKey === 'termsOfUse') displayName = 'Terms of Use';
            else if (sectionKey === 'accessibility') displayName = 'Accessibility';
            else displayName = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
            
            const isActive = activeSection === sectionKey;
            return (
              <button
                key={sectionKey}
                onClick={() => setActiveSection(sectionKey)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/15 text-accent border-l-4 border-accent shadow-sm'
                    : 'hover:bg-surface hover:shadow-sm text-text'
                }`}
              >
                {displayName}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-9">
          {activeSection === 'topNavLinks' && <TopNavLinksEditor links={content.topNavLinks} onChange={(v) => updateSection('topNavLinks', v)} />}
          {activeSection === 'mainNavItems' && <MainNavItemsEditor items={content.mainNavItems} onChange={(v) => updateSection('mainNavItems', v)} />}
          {activeSection === 'hero' && <HeroEditor hero={content.hero} onChange={(v) => updateSection('hero', v)} />}
          {activeSection === 'about' && <AboutEditor about={content.about} onChange={(v) => updateSection('about', v)} />}
          {activeSection === 'aboutItems' && <AboutItemsEditor items={content.aboutItems} onChange={(v) => updateSection('aboutItems', v)} />}
          {activeSection === 'masterplanTabs' && <MasterplanTabsEditor tabs={content.masterplanTabs} onChange={(v) => updateSection('masterplanTabs', v)} />}
          {activeSection === 'news' && <NewsEditor news={content.news} onChange={(v) => updateSection('news', v)} />}
          {activeSection === 'quickLinks' && <QuickLinksEditor links={content.quickLinks} onChange={(v) => updateSection('quickLinks', v)} />}
          {activeSection === 'footer' && <FooterEditor footer={content.footer} onChange={(v) => updateSection('footer', v)} />}
          {activeSection === 'theme' && <ThemeEditor theme={content.theme} onChange={(v) => updateSection('theme', v)} />}
          {activeSection === 'privacyPolicy' && <LegalEditor data={content.privacyPolicy} onChange={(v) => updateSection('privacyPolicy', v)} title="Privacy Policy" />}
          {activeSection === 'termsOfUse' && <LegalEditor data={content.termsOfUse} onChange={(v) => updateSection('termsOfUse', v)} title="Terms of Use" />}
          {activeSection === 'accessibility' && <LegalEditor data={content.accessibility} onChange={(v) => updateSection('accessibility', v)} title="Accessibility" />}
        </div>
      </div>
    </div>
  );
}
