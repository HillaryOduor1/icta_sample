/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from frontend .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Force tenant to 'icta_sample' for ICT Authority content
const TENANT_NAME = 'icta_sample';

const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_URL = `${API_BASE}/content?tenant=${TENANT_NAME}`;

const OUTPUT_DIR = path.join(__dirname, '../src/content');
const DEFAULT_CONTENT_FILE = path.join(OUTPUT_DIR, 'defaultContent.ts');
const TYPES_FILE = path.join(OUTPUT_DIR, 'contentTypes.ts');

// Helper to extract content from API response
function extractContentFromResponse(responseData) {
  console.log('Response data structure:', Object.keys(responseData));
  
  if (responseData && responseData.data) {
    const dataContent = responseData.data;
    
    if (Array.isArray(dataContent)) {
      if (dataContent.length === 0) {
        throw new Error('Empty data array received');
      }
      const homeContent = dataContent.find(item => item.page === 'home') || dataContent[0];
      if (homeContent && homeContent.data && typeof homeContent.data === 'object') {
        return homeContent.data;
      }
      return homeContent;
    }
    
    if (typeof dataContent === 'object') {
      if (dataContent.data && typeof dataContent.data === 'object') {
        return dataContent.data;
      }
      return dataContent;
    }
  }
  
  if (responseData && responseData.page === 'home') {
    return responseData;
  }
  
  if (Array.isArray(responseData) && responseData.length > 0) {
    const homeContent = responseData.find(item => item.page === 'home') || responseData[0];
    if (homeContent && homeContent.data) {
      return homeContent.data;
    }
    return homeContent;
  }
  
  throw new Error('Unable to extract content from response');
}

// Recursively remove _id fields
function removeNestedIds(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(item => removeNestedIds(item));
  } else if (obj && typeof obj === 'object') {
    delete obj._id;
    delete obj.__v;
    delete obj.createdAt;
    delete obj.updatedAt;
    Object.values(obj).forEach(value => removeNestedIds(value));
  }
}

// Generate TypeScript interface from object
function generateTypesFromObject(obj, indent = 0, visited = new WeakSet()) {
  const spaces = '  '.repeat(indent);
  
  if (obj === null || obj === undefined) {
    return 'any';
  }
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return 'any[]';
    }
    // Check for circular reference
    if (visited.has(obj)) {
      return 'any[]';
    }
    visited.add(obj);
    const itemType = generateTypesFromObject(obj[0], indent, visited);
    visited.delete(obj);
    return `Array<${itemType}>`;
  }
  
  if (typeof obj === 'object') {
    // Check for circular reference
    if (visited.has(obj)) {
      return 'any';
    }
    visited.add(obj);
    
    const properties = Object.entries(obj)
      .filter(([key]) => !key.startsWith('_') && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt')
      .map(([key, value]) => {
        // Skip if value is undefined
        if (value === undefined) return null;
        const type = generateTypesFromObject(value, indent + 1, visited);
        return `${spaces}  ${key}: ${type};`;
      })
      .filter(Boolean);
    
    visited.delete(obj);
    
    if (properties.length === 0) {
      return 'Record<string, unknown>';
    }
    
    return `{\n${properties.join('\n')}\n${spaces}}`;
  }
  
  if (typeof obj === 'string') return 'string';
  if (typeof obj === 'number') return 'number';
  if (typeof obj === 'boolean') return 'boolean';
  return 'any';
}

async function generate() {
  try {
    console.log(`📡 Fetching content for tenant: ${TENANT_NAME}`);
    console.log(`📡 URL: ${API_URL}`);
    
    // Check if backend is running
    try {
      await axios.get(`${API_BASE}/health`, { timeout: 3000 });
      console.log('✅ Backend server is reachable');
    } catch (healthErr) {
      console.warn('⚠️ Backend health check failed, but continuing...');
    }
    
    const response = await axios.get(API_URL, {
      timeout: 10000,
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📡 Response status: ${response.status}`);
    
    const content = extractContentFromResponse(response.data);
    
    if (!content) {
      throw new Error('No content extracted from API response');
    }
    
    console.log(`✅ Content extracted successfully`);
    console.log(`📄 Content keys: ${Object.keys(content).join(', ')}`);
    
    // Log if expected ICTA fields are present
    const expectedFields = ['aboutItems', 'masterplanTabs', 'news', 'quickLinks', 'topNavLinks', 'mainNavItems'];
    expectedFields.forEach(field => {
      if (content[field]) {
        console.log(`   ✅ Found field: ${field}`);
      } else {
        console.log(`   ⚠️ Missing field: ${field} - make sure your database has this data`);
      }
    });
    
    // Clean up content
    const cleanContent = { ...content };
    removeNestedIds(cleanContent);
    
    // Generate defaultContent.ts
    const defaultContentString = `// Auto-generated from backend API for tenant: ${TENANT_NAME}
// Generated at: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY – regenerate with \`npm run generate:content\`

export const defaultContent = ${JSON.stringify(cleanContent, null, 2)};
`;
    fs.writeFileSync(DEFAULT_CONTENT_FILE, defaultContentString);
    console.log('✅ Generated', DEFAULT_CONTENT_FILE);
    console.log(`📄 File size: ${(fs.statSync(DEFAULT_CONTENT_FILE).size / 1024).toFixed(2)} KB`);

    // Generate TypeScript interface from the actual content
    const typeDefinitions = `// Auto-generated from backend API for tenant: ${TENANT_NAME}
// Generated at: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY – regenerate with \`npm run generate:content\`

export interface SiteContent ${generateTypesFromObject(cleanContent, 0)}
`;
    
    fs.writeFileSync(TYPES_FILE, typeDefinitions);
    console.log('✅ Generated', TYPES_FILE);
    
    console.log('\n🎉 Content generation completed successfully!');
    console.log(`📁 Files updated in: ${OUTPUT_DIR}`);
    console.log(`\n📝 Next steps:`);
    console.log(`   1. Verify that all expected fields are in the generated types`);
    console.log(`   2. Run your frontend dev server: npm run dev`);
    
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.code === 'ECONNREFUSED') {
      console.error('\n🔌 Cannot connect to backend server!');
      console.error('   Make sure your backend is running on:', API_BASE);
      console.error('   Run: cd backend && npm run dev');
    }
    process.exit(1);
  }
}

generate();
/*/
* eslint-disable no-undef /
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { compile } from 'json-schema-to-typescript';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from frontend .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Read tenant name from environment (default to 'landscapes_integrity_solutions')
const TENANT_NAME = process.env.VITE_TENANT_NAME ;

// Use VITE_API_URL from env, fallback to localhost
// FIX: Add /v1/ to the API path
const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_URL = `${API_BASE}/content?tenant=${TENANT_NAME}`;

const OUTPUT_DIR = path.join(__dirname, '../src/content');
const DEFAULT_CONTENT_FILE = path.join(OUTPUT_DIR, 'defaultContent.ts');
const TYPES_FILE = path.join(OUTPUT_DIR, 'contentTypes.ts');

// Helper to extract content from API response
function extractContentFromResponse(responseData) {
  console.log('Response data structure:', Object.keys(responseData));
  
  // Case 1: Our backend success response format: { success: true, message: "...", data: {...} }
  if (responseData && responseData.data) {
    const dataContent = responseData.data;
    
    // If data is an array, find home page or take first item
    if (Array.isArray(dataContent)) {
      if (dataContent.length === 0) {
        throw new Error('Empty data array received');
      }
      const homeContent = dataContent.find(item => item.page === 'home') || dataContent[0];
      // Check if the content has a nested data property (from transformer)
      if (homeContent && homeContent.data && typeof homeContent.data === 'object') {
        return homeContent.data;
      }
      return homeContent;
    }
    
    // If data is an object (single content)
    if (typeof dataContent === 'object') {
      // Check if it has a nested data property (from transformer)
      if (dataContent.data && typeof dataContent.data === 'object') {
        return dataContent.data;
      }
      return dataContent;
    }
  }
  
  // Case 2: Direct content object
  if (responseData && responseData.page === 'home') {
    return responseData;
  }
  
  // Case 3: Array of content items
  if (Array.isArray(responseData) && responseData.length > 0) {
    const homeContent = responseData.find(item => item.page === 'home') || responseData[0];
    if (homeContent && homeContent.data) {
      return homeContent.data;
    }
    return homeContent;
  }
  
  throw new Error('Unable to extract content from response');
}

async function generate() {
  try {
    console.log(`📡 Fetching content for tenant: ${TENANT_NAME}`);
    console.log(`📡 URL: ${API_URL}`);
    
    const response = await axios.get(API_URL, {
      timeout: 10000,
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📡 Response status: ${response.status}`);
    console.log(`📡 Response headers:`, response.headers['content-type']);
    
    // Extract the actual content from the response
    const content = extractContentFromResponse(response.data);
    
    if (!content) {
      throw new Error('No content extracted from API response');
    }
    
    console.log(`✅ Content extracted successfully`);
    console.log(`📄 Content keys: ${Object.keys(content).join(', ')}`);
    
    // Remove any internal fields that shouldn't be in default content
    const cleanContent = { ...content };
    delete cleanContent._id;
    delete cleanContent.__v;
    delete cleanContent.createdAt;
    delete cleanContent.updatedAt;
    delete cleanContent.tenantId;
    
    // Generate defaultContent.ts
    const defaultContentString = `// Auto-generated from backend API for tenant: ${TENANT_NAME}
// Generated at: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY – regenerate with \`npm run generate:content\`

export const defaultContent = ${JSON.stringify(cleanContent, null, 2)};
`;
    fs.writeFileSync(DEFAULT_CONTENT_FILE, defaultContentString);
    console.log('✅ Generated', DEFAULT_CONTENT_FILE);
    console.log(`📄 File size: ${(fs.statSync(DEFAULT_CONTENT_FILE).size / 1024).toFixed(2)} KB`);

    // Generate a more accurate TypeScript interface
    const generateTypesFromObject = (obj, indent = 0) => {
      const spaces = '  '.repeat(indent);
      if (Array.isArray(obj)) {
        if (obj.length === 0) return 'any[]';
        return `Array<${generateTypesFromObject(obj[0], indent)}>`;
      }
      if (obj && typeof obj === 'object') {
        const properties = Object.entries(obj)
          .filter(([key]) => !key.startsWith('_')) // Skip internal fields
          .map(([key, value]) => {
            const type = generateTypesFromObject(value, indent + 1);
            return `${spaces}  ${key}: ${type};`;
          });
        return `{\n${properties.join('\n')}\n${spaces}}`;
      }
      if (typeof obj === 'string') return 'string';
      if (typeof obj === 'number') return 'number';
      if (typeof obj === 'boolean') return 'boolean';
      return 'any';
    };
    
    const typeDefinitions = `// Auto-generated from backend API for tenant: ${TENANT_NAME}
// Generated at: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY – regenerate with \`npm run generate:content\`

export interface SiteContent ${generateTypesFromObject(cleanContent, 0)}
`;
    
    fs.writeFileSync(TYPES_FILE, typeDefinitions);
    console.log('✅ Generated', TYPES_FILE);
    
    console.log('\n🎉 Content generation completed successfully!');
    console.log(`📁 Files updated in: ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.request) {
      console.error('No response received from server');
    }
    process.exit(1);
  }
}

generate();*/

/*works but fetches from wrong backend endpoint
/* eslint-disable no-undef /
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { compile } from 'json-schema-to-typescript';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from frontend .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Read tenant name from environment (default to 'landscapes_integrity_solutions')
const TENANT_NAME = process.env.VITE_TENANT_NAME || 'landscapes_integrity_solutions';

// Use VITE_API_URL from env, fallback to localhost
const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${API_BASE}/content?tenant=${TENANT_NAME}`;

const OUTPUT_DIR = path.join(__dirname, '../src/content');
const DEFAULT_CONTENT_FILE = path.join(OUTPUT_DIR, 'defaultContent.ts');
const TYPES_FILE = path.join(OUTPUT_DIR, 'contentTypes.ts');

async function generate() {
  try {
    console.log(`📡 Fetching content for tenant: ${TENANT_NAME}`);
    console.log(`📡 URL: ${API_URL}`);
    
    const response = await axios.get(API_URL, {
      timeout: 10000,
      headers: { 'Accept': 'application/json' }
    });
    
    const contentArray = response.data;
    const content = Array.isArray(contentArray) ? contentArray[0] : contentArray;
    
    if (!content) throw new Error('No content received from API');

    // Generate defaultContent.ts
    const defaultContentString = `// Auto-generated from backend API for tenant: ${TENANT_NAME}
// DO NOT EDIT MANUALLY – regenerate with \`npm run generate:content\`
export const defaultContent = ${JSON.stringify(content, null, 2)};
`;
    fs.writeFileSync(DEFAULT_CONTENT_FILE, defaultContentString);
    console.log('✅ Generated', DEFAULT_CONTENT_FILE);

    // Generate TypeScript interfaces (simple inference)
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: Object.fromEntries(
        Object.entries(content).map(([key, value]) => [
          key,
          { 
            type: value === null ? 'null' :
                   typeof value === 'object' && !Array.isArray(value) ? 'object' : 
                   Array.isArray(value) ? 'array' : typeof value
          }
        ])
      ),
      additionalProperties: true
    };
   
    const types = await compile(schema,'SiteContent',{
      bannerComment:`/*Auto generated for tenant:${TENANT_NAME}-DO NOT EDIT MANUALLY /\n`,
      style:{singleQuote:true}
    });
    fs.writeFileSync(TYPES_FILE, types);
    console.log('✅ Generated', TYPES_FILE);
    
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

generate();*/
/*
/* eslint-disable no-undef /
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { compile } from 'json-schema-to-typescript';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from frontend .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Read tenant name from environment (default to 'landscapes_integrity_solutions')
const TENANT_NAME = process.env.VITE_TENANT_NAME || 'landscapes_integrity_solutions';
const API_URL = `http://localhost:5000/api/content?tenant=${TENANT_NAME}`;

const OUTPUT_DIR = path.join(__dirname, '../src/content');
const DEFAULT_CONTENT_FILE = path.join(OUTPUT_DIR, 'defaultContent.ts');
const TYPES_FILE = path.join(OUTPUT_DIR, 'contentTypes.ts');

async function generate() {
  try {
    console.log(`📡 Fetching content for tenant: ${TENANT_NAME}`);
    console.log(`📡 URL: ${API_URL}`);
    
    const response = await axios.get(API_URL, {
      timeout: 10000,
      headers: { 'Accept': 'application/json' }
    });
    
    const contentArray = response.data;
    const content = Array.isArray(contentArray) ? contentArray[0] : contentArray;
    
    if (!content) throw new Error('No content received from API');

    // Generate defaultContent.ts
    const defaultContentString = `// Auto-generated from backend API for tenant: ${TENANT_NAME}
// DO NOT EDIT MANUALLY – regenerate with \`npm run generate:content\`
export const defaultContent = ${JSON.stringify(content, null, 2)};
`;
    fs.writeFileSync(DEFAULT_CONTENT_FILE, defaultContentString);
    console.log('✅ Generated', DEFAULT_CONTENT_FILE);

    // Generate TypeScript interfaces (simple inference)
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: Object.fromEntries(
        Object.entries(content).map(([key, value]) => [
          key,
          { 
            type: value === null ? 'null' :
                   typeof value === 'object' && !Array.isArray(value) ? 'object' : 
                   Array.isArray(value) ? 'array' : typeof value
          }
        ])
      ),
      additionalProperties: true
    };
   
    const types = await compile(schema,'SiteContent',{
      bannerComment:`/*Auto generated for tenant:${TENANT_NAME}-DO NOT EDIT MANUALLY /\n`,
      style:{singleQuote:true}
    });
    fs.writeFileSync(TYPES_FILE, types);
    console.log('✅ Generated', TYPES_FILE);
    
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

generate();
*/

/*import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { compile } from 'json-schema-to-typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:5000/api/content?tenant=landscapes_integrity_solutions';
const OUTPUT_DIR = path.join(__dirname, '../src/content');
const DEFAULT_CONTENT_FILE = path.join(OUTPUT_DIR, 'defaultContent.ts');
const TYPES_FILE = path.join(OUTPUT_DIR, 'contentTypes.ts');

async function generate() {
  try {
    console.log('📡 Fetching content from', API_URL);
    const response = await axios.get(API_URL);
    const contentArray = response.data;
    const content = Array.isArray(contentArray) ? contentArray[0] : contentArray;
    if (!content) throw new Error('No content received');

    // defaultContent.ts
    const defaultContentString = `// Auto-generated from backend API - DO NOT EDIT MANUALLY
export const defaultContent = ${JSON.stringify(content, null, 2)};
`;
    fs.writeFileSync(DEFAULT_CONTENT_FILE, defaultContentString);
    console.log('✅ Generated', DEFAULT_CONTENT_FILE);

    // TypeScript interfaces (simplified schema)
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: Object.fromEntries(
        Object.entries(content).map(([key, value]) => [
          key,
          { type: typeof value === 'object' && !Array.isArray(value) ? 'object' : Array.isArray(value) ? 'array' : typeof value }
        ])
      ),
      additionalProperties: true
    };
    const types = await compile(schema, 'SiteContent', {
      bannerComment: '/* Auto-generated from backend API - DO NOT EDIT MANUALLY /\n',
      style: { singleQuote: true }
    });
    fs.writeFileSync(TYPES_FILE, types);
    console.log('✅ Generated', TYPES_FILE);
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    process.exit(1);
  }
}

generate();*/