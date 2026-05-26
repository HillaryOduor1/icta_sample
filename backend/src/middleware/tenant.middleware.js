import { getMasterConnection } from '../config/database.js';
import { redisClient } from '../config/redis.js';
import { TenantModel } from '../database/models/tenant.model.js';
import connectDB from '../config/database.js';
import { UserModel } from '../database/models/user.model.js';
import { getSettingsModel } from '../database/models/settings.model.js';
import { ContentModel } from '../database/models/content.model.js';
import { MediaModel } from '../database/models/media.model.js';
import { ActivityLogModel } from '../database/models/activityLog.model.js';
import { ContactMessageModel } from '../database/models/contactMessage.model.js';
import { config } from '../config/env.js';
import { AnalyticsModel } from '../database/models/analytics.model.js';
import { HeatmapClickModel } from '../database/models/heatmapClick.model.js';
import { FunnelModel } from '../database/models/funnel.model.js';
import { UsageRecordModel } from '../database/models/usageRecord.model.js';
import { PendingUserModel } from '../database/models/pendingUser.js';

export const tenantMiddleware = async (req, res, next) => {
  try {
    // FIRST: Check if this is a master route (no tenant needed)
    if (req.path.includes('/master/') || req.path.includes('/auth/master')) {
      console.log('[Tenant] Master route - proceeding without tenant');
      req.tenant = null;
      req.tenantId = null;
      req.models = null;
      return next();
    }

    let tenant = null;
    let tenantId = null;
    
    // PRIORITY 1: Check if user is authenticated and has tenantId in JWT
    if (req.user && req.user.tenantId) {
      console.log(`[Tenant] Using tenantId from JWT: ${req.user.tenantId}`);
      tenantId = req.user.tenantId;
    }
    
    // PRIORITY 2: If no tenantId from JWT, try from query param or host header
    /*if (!tenantId) {
      const identifier = req.query.tenant || req.headers.host?.split(':')[0];
      console.log(`[Tenant] Looking up tenant by identifier: ${identifier}`);
      
      if (identifier) {
        const cacheKey = `tenant:${identifier}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          tenant = JSON.parse(cached);
          tenantId = tenant.dbName;
          console.log(`[Tenant] Found tenant in cache: ${tenantId}`);
        } else {
          const masterConn = await getMasterConnection();
          const Tenant = masterConn.model('Tenant', TenantModel.schema);
          tenant = await Tenant.findOne({
            $or: [{ dbName: identifier }, { domain: identifier }]
          }).lean();
          if (tenant) {
            tenantId = tenant.dbName;
            await redisClient.setex(cacheKey, 300, JSON.stringify(tenant));
            console.log(`[Tenant] Found tenant in DB: ${tenantId}`);
          }
        }
      }
    }*/
    if (!tenantId) {
      let identifier = req.query.tenant || req.headers.host?.split(':')[0];
      console.log(`[Tenant] Looking up tenant by identifier: ${identifier}`);
      
      if (identifier) {
        // Normalize identifier for lookup
        const normalizedIdentifier = identifier.toLowerCase();
        const cacheKey = `tenant:${normalizedIdentifier}`;
        const cached = await redisClient.get(cacheKey);
        
        if (cached) {
          tenant = JSON.parse(cached);
          tenantId = tenant.dbName;
          console.log(`[Tenant] Found tenant in cache: ${tenantId}`);
        } else {
          const masterConn = await getMasterConnection();
          const Tenant = masterConn.model('Tenant', TenantModel.schema);
          
          // Try multiple lookup strategies
          tenant = await Tenant.findOne({
            $or: [
              { dbName: { $regex: new RegExp(`^${normalizedIdentifier}$`, 'i') } },  // Case-insensitive dbName
              { domain: normalizedIdentifier },
              { domain: identifier },
              { siteId: normalizedIdentifier }
            ]
          }).lean();
          
          if (tenant) {
            tenantId = tenant.dbName;
            await redisClient.setex(cacheKey, 300, JSON.stringify(tenant));
            console.log(`[Tenant] Found tenant in DB: ${tenantId} (by ${tenant.dbName === identifier ? 'dbName' : 'other'})`);
          }
        }
      }
    }
    
    // PRIORITY 3: Fallback to default tenant from .env if no tenant found (development)
    /*if (!tenantId && config.defaultTenantDbName) {
      const defaultDbName = config.defaultTenantDbName;
      console.log(`[Tenant] Using default tenant: ${defaultDbName}`);
      const masterConn = await getMasterConnection();
      const Tenant = masterConn.model('Tenant', TenantModel.schema);
      tenant = await Tenant.findOne({ dbName: defaultDbName }).lean();
      /*if (!tenant) {
        tenant = await Tenant.create({
          name: defaultDbName.replace(/_/g, ' '),
          dbName: defaultDbName,
          domain: 'localhost',
        });
        console.log(`[Tenant] Created default tenant: ${defaultDbName}`);
      }/
     if (!tenant) {
        // Generate a siteId from the dbName or use a default
        const siteId = defaultDbName.replace(/_/g, '-').toLowerCase();
        tenant = await Tenant.create({
          name: defaultDbName.replace(/_/g, ' '),
          dbName: defaultDbName,
          domain: 'localhost',
          siteId: siteId,  // Add this required field
          contactEmail: config.smtp?.from || 'admin@example.com',  // Optional but good to have
        });
        console.log(`[Tenant] Created default tenant: ${defaultDbName} with siteId: ${siteId}`);
      }
      tenantId = tenant.dbName;
    }*/
    if (!tenantId && config.defaultTenantDbName) {
      let defaultDbName = config.defaultTenantDbName;
      // Normalize the default tenant name (convert to lowercase, replace spaces with underscores)
      defaultDbName = defaultDbName.toLowerCase().replace(/\s+/g, '_');
      console.log(`[Tenant] Looking for default tenant: ${defaultDbName}`);
      
      const masterConn = await getMasterConnection();
      const Tenant = masterConn.model('Tenant', TenantModel.schema);
      
      // Try to find existing tenant
      tenant = await Tenant.findOne({ 
        $or: [
          { dbName: defaultDbName },
          { dbName: { $regex: new RegExp(`^${defaultDbName}$`, 'i') } }
        ]
      }).lean();
      
      if (!tenant) {
        // Try to find by siteId pattern
        tenant = await Tenant.findOne({ 
          siteId: { $exists: true, $ne: null } 
        }).lean();
      }
      
      if (tenant) {
        tenantId = tenant.dbName;
        console.log(`[Tenant] Found existing tenant: ${tenantId}`);
      } else {
        // Only create if absolutely necessary
        console.warn(`[Tenant] No tenant found, but skipping auto-creation to avoid siteId error`);
        return res.status(404).json({ success: false, message: 'Tenant not found. Please configure tenant properly.' });
      }
    }

    // If still no tenant, return error
    if (!tenantId) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    // Get tenant document if we don't have it yet
    if (!tenant) {
      const masterConn = await getMasterConnection();
      const Tenant = masterConn.model('Tenant', TenantModel.schema);
      tenant = await Tenant.findOne({ dbName: tenantId }).lean();
    }

    req.tenant = tenant;
    req.tenantId = tenantId;

    // Connect to tenant database and attach models
    const conn = await connectDB(tenantId);
    req.models = {
      User: conn.models.User || conn.model('User', UserModel.schema),
      PendingUser: conn.models.PendingUser || conn.model('PendingUser', PendingUserModel.schema),
      Settings: getSettingsModel(conn),
      Content: conn.models.Content || conn.model('Content', ContentModel.schema),
      Media: conn.models.Media || conn.model('Media', MediaModel.schema),
      ActivityLog: conn.models.ActivityLog || conn.model('ActivityLog', ActivityLogModel.schema),
      ContactMessage: conn.models.ContactMessage || conn.model('ContactMessage', ContactMessageModel.schema),
      Analytics: conn.models.Analytics || conn.model('Analytics', AnalyticsModel.schema),
      HeatmapClick: conn.models.HeatmapClick || conn.model('HeatmapClick', HeatmapClickModel.schema),
      Funnel: conn.models.Funnel || conn.model('Funnel', FunnelModel.schema),
      UsageRecord: conn.models.UsageRecord || conn.model('UsageRecord', UsageRecordModel.schema),
    };
    
    console.log(`[Tenant] Connected to database: ${tenantId}`);
    next();
  } catch (err) {
    console.error('[Tenant] Error:', err);
    next(err);
  }
};
/*import { getMasterConnection } from '../config/database.js';
import { redisClient } from '../config/redis.js';
import { TenantModel } from '../database/models/tenant.model.js';
import connectDB from '../config/database.js';
import { UserModel } from '../database/models/user.model.js';
import { getSettingsModel } from '../database/models/settings.model.js';
import { ContentModel } from '../database/models/content.model.js';
import { MediaModel } from '../database/models/media.model.js';
import { ActivityLogModel } from '../database/models/activityLog.model.js';
import { ContactMessageModel } from '../database/models/contactMessage.model.js';
import { config } from '../config/env.js';
import { AnalyticsModel } from '../database/models/analytics.model.js';
import { HeatmapClickModel } from '../database/models/heatmapClick.model.js';
import { FunnelModel } from '../database/models/funnel.model.js';
import { UsageRecordModel } from '../database/models/usageRecord.model.js';

export const tenantMiddleware = async (req, res, next) => {
  try {
    let tenant = null;
    let tenantId = null;
    
    // PRIORITY 1: Check if user is authenticated and has tenantId in JWT
    if (req.user && req.user.tenantId) {
      console.log(`[Tenant] Using tenantId from JWT: ${req.user.tenantId}`);
      tenantId = req.user.tenantId;
    }
    
    // PRIORITY 2: If no tenantId from JWT, try from query param or host header
    if (!tenantId) {
      const identifier = req.query.tenant || req.headers.host?.split(':')[0];
      console.log(`[Tenant] Looking up tenant by identifier: ${identifier}`);
      
      if (identifier) {
        const cacheKey = `tenant:${identifier}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          tenant = JSON.parse(cached);
          tenantId = tenant.dbName;
          console.log(`[Tenant] Found tenant in cache: ${tenantId}`);
        } else {
          const masterConn = await getMasterConnection();
          const Tenant = masterConn.model('Tenant', TenantModel.schema);
          tenant = await Tenant.findOne({
            $or: [{ dbName: identifier }, { domain: identifier }]
          }).lean();
          if (tenant) {
            tenantId = tenant.dbName;
            await redisClient.setex(cacheKey, 300, JSON.stringify(tenant));
            console.log(`[Tenant] Found tenant in DB: ${tenantId}`);
          }
        }
      }
    }
    
    // PRIORITY 3: Fallback to default tenant from .env if no tenant found (development)
    if (!tenantId && config.defaultTenantDbName) {
      const defaultDbName = config.defaultTenantDbName;
      console.log(`[Tenant] Using default tenant: ${defaultDbName}`);
      const masterConn = await getMasterConnection();
      const Tenant = masterConn.model('Tenant', TenantModel.schema);
      tenant = await Tenant.findOne({ dbName: defaultDbName }).lean();
      if (!tenant) {
        // Create a default tenant record if it doesn't exist
        tenant = await Tenant.create({
          name: defaultDbName.replace(/_/g, ' '),
          dbName: defaultDbName,
          domain: 'localhost',
        });
        console.log(`[Tenant] Created default tenant: ${defaultDbName}`);
      }
      tenantId = tenant.dbName;
    }

    // If still no tenant, return error (except for master routes that don't need tenant)
    if (!tenantId) {
      // Check if this is a master route (no tenant needed)
      if (req.path.includes('/master/') || req.path.includes('/auth/master')) {
        console.log('[Tenant] Master route - proceeding without tenant');
        req.tenant = null;
        req.tenantId = null;
        req.models = null;
        return next();
      }
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    // Get tenant document if we don't have it yet
    if (!tenant) {
      const masterConn = await getMasterConnection();
      const Tenant = masterConn.model('Tenant', TenantModel.schema);
      tenant = await Tenant.findOne({ dbName: tenantId }).lean();
    }

    req.tenant = tenant;
    req.tenantId = tenantId;

    // Connect to tenant database and attach models
    const conn = await connectDB(tenantId);
    req.models = {
      User: conn.models.User || conn.model('User', UserModel.schema),
      Settings: getSettingsModel(conn),
      Content: conn.models.Content || conn.model('Content', ContentModel.schema),
      Media: conn.models.Media || conn.model('Media', MediaModel.schema),
      ActivityLog: conn.models.ActivityLog || conn.model('ActivityLog', ActivityLogModel.schema),
      ContactMessage: conn.models.ContactMessage || conn.model('ContactMessage', ContactMessageModel.schema),
      Analytics: conn.models.Analytics || conn.model('Analytics', AnalyticsModel.schema),
      HeatmapClick: conn.models.HeatmapClick || conn.model('HeatmapClick', HeatmapClickModel.schema),
      Funnel: conn.models.Funnel || conn.model('Funnel', FunnelModel.schema),
      UsageRecord: conn.models.UsageRecord || conn.model('UsageRecord', UsageRecordModel.schema),
    };
    
    console.log(`[Tenant] Connected to database: ${tenantId}`);
    next();
  } catch (err) {
    console.error('[Tenant] Error:', err);
    next(err);
  }
};*/


/*import { getMasterConnection } from '../config/database.js';
import { redisClient } from '../config/redis.js';
import { TenantModel } from '../database/models/tenant.model.js';
import connectDB from '../config/database.js';
import { UserModel } from '../database/models/user.model.js';
//import { SettingsModel } from '../database/models/settings.model.js';
import { getSettingsModel } from '../database/models/settings.model.js';
import { ContentModel } from '../database/models/content.model.js';
import { MediaModel } from '../database/models/media.model.js';
import { ActivityLogModel } from '../database/models/activityLog.model.js';
import { ContactMessageModel } from '../database/models/contactMessage.model.js';
import { config } from '../config/env.js';
import { AnalyticsModel } from '../database/models/analytics.model.js';
import { HeatmapClickModel } from '../database/models/heatmapClick.model.js';
import { FunnelModel } from '../database/models/funnel.model.js';
import { UsageRecordModel } from '../database/models/usageRecord.model.js';

export const tenantMiddleware = async (req, res, next) => {
  try {
    let tenant = null;
    const identifier = req.query.tenant || req.headers.host?.split(':')[0];

    if (identifier) {
      const cacheKey = `tenant:${identifier}`;
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        tenant = JSON.parse(cached);
      } else {
        const masterConn = await getMasterConnection();
        const Tenant = masterConn.model('Tenant', TenantModel.schema);
        tenant = await Tenant.findOne({
          $or: [{ dbName: identifier }, { domain: identifier }]
        }).lean();
        if (tenant) {
          await redisClient.setex(cacheKey, 300, JSON.stringify(tenant));
        }
      }
    }

    // Fallback to default tenant from .env if no tenant found (development)
    if (!tenant && config.defaultTenantDbName) {
      const defaultDbName = config.defaultTenantDbName;
      const masterConn = await getMasterConnection();
      const Tenant = masterConn.model('Tenant', TenantModel.schema);
      tenant = await Tenant.findOne({ dbName: defaultDbName }).lean();
      if (!tenant) {
        // Create a default tenant record if it doesn't exist
        tenant = await Tenant.create({
          name: defaultDbName.replace(/_/g, ' '),
          dbName: defaultDbName,
          domain: 'localhost',
        });
      }
    }

    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    req.tenant = tenant;
    req.tenantId = tenant.dbName;

    const conn = await connectDB(tenant.dbName);
    /*req.models = {
      User: conn.model('User', UserModel.schema),
      Settings: conn.model('Settings', SettingsModel.schema),
      Content: conn.model('Content', ContentModel.schema),
      Media: conn.model('Media', MediaModel.schema),
      ActivityLog: conn.model('ActivityLog', ActivityLogModel.schema),
      ContactMessage: conn.model('ContactMessage', ContactMessageModel.schema),
    };*/
    /*req.models={
    User: conn.models.User || conn.model('User', UserModel.schema),
    //Settings: conn.models.Settings || conn.model('Settings', getSettingsModel(conn)),
    Settings: getSettingsModel(conn),
    Content: conn.models.Content || conn.model('Content', ContentModel.schema),
    Media: conn.models.Media || conn.model('Media', MediaModel.schema),
    ActivityLog: conn.models.ActivityLog || conn.model('ActivityLog', ActivityLogModel.schema),
    ContactMessage: conn.models.ContactMessage || conn.model('ContactMessage', ContactMessageModel.schema),
    
    };/
    req.models = {
      User: conn.models.User || conn.model('User', UserModel.schema),
      Settings: getSettingsModel(conn),
      Content: conn.models.Content || conn.model('Content', ContentModel.schema),
      Media: conn.models.Media || conn.model('Media', MediaModel.schema),
      ActivityLog: conn.models.ActivityLog || conn.model('ActivityLog', ActivityLogModel.schema),
      ContactMessage: conn.models.ContactMessage || conn.model('ContactMessage', ContactMessageModel.schema),
      Analytics: conn.models.Analytics || conn.model('Analytics', AnalyticsModel.schema),
      HeatmapClick: conn.models.HeatmapClick || conn.model('HeatmapClick', HeatmapClickModel.schema),
      Funnel: conn.models.Funnel || conn.model('Funnel', FunnelModel.schema),
      UsageRecord: conn.models.UsageRecord || conn.model('UsageRecord', UsageRecordModel.schema),
    };
    next();
  } catch (err) {
    next(err);
  }
};*/
/*import { getMasterConnection } from '../config/database.js';
import { redisClient } from '../config/redis.js';
import { TenantModel } from '../database/models/tenant.model.js';
import connectDB from '../config/database.js';
import { UserModel } from '../database/models/user.model.js';
import { SettingsModel } from '../database/models/settings.model.js';
import { ContentModel } from '../database/models/content.model.js';
import { MediaModel } from '../database/models/media.model.js';
import { ActivityLogModel } from '../database/models/activityLog.model.js';
import { ContactMessageModel } from '../database/models/contactMessage.model.js';

export const tenantMiddleware = async (req, res, next) => {
  try {
    let tenant = null;
    const identifier = req.query.tenant || req.headers.host?.split(':')[0];
    if (!identifier) {
      return res.status(404).json({ success: false, message: 'Tenant identifier missing' });
    }

    const cacheKey = `tenant:${identifier}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      tenant = JSON.parse(cached);
    } else {
      const masterConn = await getMasterConnection();
      const Tenant = masterConn.model('Tenant', TenantModel.schema);
      tenant = await Tenant.findOne({
        $or: [{ dbName: identifier }, { domain: identifier }]
      }).lean();
      if (tenant) {
        await redisClient.setex(cacheKey, 300, JSON.stringify(tenant)); // cache for 5 minutes
      }
    }

    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    req.tenant = tenant;
    req.tenantId = tenant.dbName;

    // Connect to the tenant's database and attach models
    const conn = await connectDB(tenant.dbName);
    req.models = {
      User: conn.model('User', UserModel.schema),
      Settings: conn.model('Settings', SettingsModel.schema),
      Content: conn.model('Content', ContentModel.schema),
      Media: conn.model('Media', MediaModel.schema),
      ActivityLog: conn.model('ActivityLog', ActivityLogModel.schema),
      ContactMessage: conn.model('ContactMessage', ContactMessageModel.schema),
    };
    next();
  } catch (err) {
    next(err);
  }
};*/


/*
export const tenantMiddleware = async (req, res, next) => {
  try {
    let tenant = null;
    // 1. From query param
    const tenantParam = req.query.tenant;
    if (tenantParam) {
      tenant = await tenantService.resolveTenant(tenantParam, 'dbName');
    }
    // 2. From host header
    if (!tenant && req.headers.host) {
      const host = req.headers.host.split(':')[0];
      tenant = await tenantService.resolveTenant(host, 'domain');
    }
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    req.tenant = tenant;
    req.tenantId = tenant.dbName;

    // Attach tenant-specific models
    const conn = await connectDB(tenant.dbName);
    req.models = {
      User: conn.model('User', UserModel.schema),
      Settings: conn.model('Settings', SettingsModel.schema),
      Content: conn.model('Content', ContentModel.schema),
      Media: conn.model('Media', MediaModel.schema),
      ActivityLog: conn.model('ActivityLog', ActivityLogModel.schema),
      ContactMessage: conn.model('ContactMessage', ContactMessageModel.schema),
    };
    next();
  } catch (err) {
    next(err);
  }
};*/


/*last stable 
const Tenant = require("../database/models/tenant.model");
const connectDB = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    console.log('📍 Tenant middleware start');
    let tenant = null;
    
    // 1. Check query parameter 'tenant' (by dbName)
    const tenantParam = req.query.tenant;
    if (tenantParam) {
      tenant = await Tenant.findOne({ dbName: tenantParam });
      if (tenant) console.log(`✅ Tenant found via query param: ${tenant.dbName}`);
    }
    
    // 2. Fallback to Host header
    if (!tenant) {
      const host = req.headers.host.split(":")[0];
      console.log('Host:', host);
      tenant = await Tenant.findOne({ domain: host });
      if (tenant) console.log(`✅ Tenant found via host: ${tenant.dbName}`);
    }
    
    // 3. If still no tenant, try to find by the known correct dbName (hardcoded for now, but you can make it configurable)
    if (!tenant) {
      // This ensures we find the tenant that actually has data
      tenant = await Tenant.findOne({ dbName: "landscapes_integrity_solutions" });
      if (tenant) console.log(`✅ Tenant found via fallback: ${tenant.dbName}`);
    }

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const tenantConn = await connectDB(tenant.dbName);
    console.log('Tenant DB connection established');

    req.tenant = tenant;
    req.models = {
      User: tenantConn.models.User || tenantConn.model('User', require('../database/models/user.model')),
      Settings: tenantConn.models.Settings || tenantConn.model('Settings', require('../database/models/settings.model')),
      Content: tenantConn.models.Content || tenantConn.model('Content', require('../database/models/content.model')),
      Media: tenantConn.models.Media || tenantConn.model('Media', require('../database/models/media.model')),
      ActivityLog: tenantConn.models.ActivityLog || tenantConn.model('ActivityLog', require('../database/models/activityLog.model')),
      ContactMessage: tenantConn.models.ContactMessage || tenantConn.model('ContactMessage', require('../database/models/contactMessage.model')),
    };
    console.log('Models attached to req');
    console.log('Models attached to req:', Object.keys(req.models));

    next();
  } catch (err) {
    console.error('❌ Tenant middleware error:', err);
    res.status(500).json({ message: err.message });
  }
};*/

/*const Tenant = require("../models/Tenant");
const connectDB = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    console.log('📍 Tenant middleware start');
    const host = req.headers.host.split(":")[0];
    console.log('Host:', host);
    
    const tenant = await Tenant.findOne({ domain: host });
    console.log('Tenant found:', tenant ? tenant.dbName : 'none');

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const tenantConn = await connectDB(tenant.dbName);
    console.log('Tenant DB connection established');

    req.tenant = tenant;
    req.models = {
      User: tenantConn.models.User || tenantConn.model('User', require('../models/User')),
      Settings: tenantConn.models.Settings || tenantConn.model('Settings', require('../models/Settings')),
      Content: tenantConn.models.Content || tenantConn.model('Content', require('../models/Content')),
      Media: tenantConn.models.Media || tenantConn.model('Media', require('../models/Media')),
      ActivityLog: tenantConn.models.ActivityLog || tenantConn.model('ActivityLog', require('../models/ActivityLog')),
    };
    console.log('Models attached to req');

    next();
  } catch (err) {
    console.error('❌ Tenant middleware error:', err);
    res.status(500).json({ message: err.message });
  }
};*/
/*const Tenant = require("../models/Tenant");
const connectDB = require("../config/db");

module.exports = async (req, res, next) => {
    try {
        console.log('📍 Tenant middleware start');
        const host = req.headers.host.split(":")[0];
        console.log('Host:', host);
        
        const tenant = await Tenant.findOne({ domain: host });
        console.log('Tenant found:', tenant ? tenant.dbName : 'none');

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        const tenantConn = await connectDB(tenant.dbName);
        console.log('Tenant DB connection established');

        req.tenant = tenant;
        /*req.models = {
            User: tenantConn.model('User', require('../models/User')),
            Settings: tenantConn.model('Settings', require('../models/Settings')),
            Content: tenantConn.model('Content', require('../models/Content')),
            Media: tenantConn.model('Media', require('../models/Media')),
            ActivityLog: tenantConn.model('ActivityLog', require('../models/ActivityLog')),
        };/
        req.models = {
            User: tenantConn.models.User || tenantConn.model('User', require('../models/User')),
            Settings: tenantConn.models.Settings || tenantConn.model('Settings', require('../models/Settings')),
            Content: tenantConn.models.Content || tenantConn.model('Content', require('../models/Content')),
            Media: tenantConn.models.Media || tenantConn.model('Media', require('../models/Media')),
            ActivityLog: tenantConn.models.ActivityLog || tenantConn.model('ActivityLog', require('../models/ActivityLog')),
        };
        console.log('Models attached to req');

        next();
    } catch (err) {
        console.error('❌ Tenant middleware error:', err);
        res.status(500).json({ message: err.message });
    }
};*/


/*const Tenant = require("../models/Tenant");
const connectDB = require("../config/db");

module.exports = async (req, res, next) => {
    try {
        const host = req.headers.host.split(":")[0];
        const tenant = await Tenant.findOne({ domain: host });

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        // Connect to tenant DB
        const tenantConn = await connectDB(tenant.dbName);

        // Attach models to request
        req.tenant = tenant;
        req.models = {
            User: tenantConn.model('User', require('../models/User')),
            Settings: tenantConn.model('Settings', require('../models/Settings')),
            Content: tenantConn.model('Content', require('../models/Content')),
            Media: tenantConn.model('Media', require('../models/Media')),
            ActivityLog: tenantConn.model('ActivityLog', require('../models/ActivityLog')),
        };

        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};*/
/*const Tenant = require("../models/Tenant");

module.exports = async (req, res, next) => {
    try {
        const host = req.headers.host.split(":")[0];

        const tenant = await Tenant.findOne({ domain: host });

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        req.tenant = tenant;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};*/