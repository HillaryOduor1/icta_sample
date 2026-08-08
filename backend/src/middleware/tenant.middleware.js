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
