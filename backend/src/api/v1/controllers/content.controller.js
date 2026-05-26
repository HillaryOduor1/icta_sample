import { ContentService } from '../services/content.service.js';
import { ContentTransformer } from '../transformers/content.transformer.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';
import { ValidationError } from '../../../shared/errors/ValidationError.js';

export const getAllContent = asyncHandler(async (req, res) => {
  const contentService = new ContentService(req.models.Content, req.models.ActivityLog);
  const content = await contentService.getAllContent(req.tenantId);
  const transformed = content.map(c => ContentTransformer.toResponse(c));
  return successResponse(res, 200, 'Content retrieved', transformed);
});

export const getContentByPage = asyncHandler(async (req, res) => {
  const contentService = new ContentService(req.models.Content, req.models.ActivityLog);
  const content = await contentService.getContentByPage(req.params.page, req.tenantId);
  return successResponse(res, 200, 'Content retrieved', ContentTransformer.toResponse(content));
});

/*export const updateContent = asyncHandler(async (req, res) => {
  const contentService = new ContentService(req.models.Content, req.models.ActivityLog);
  const { page } = req.body;
  if (!page) throw new ValidationError('Page field required');
  const updated = await contentService.updateContent(page, req.tenantId, req.body, req.user.sub, req.user.username);
  return successResponse(res, 200, 'Content updated', ContentTransformer.toResponse(updated));
});*/
// backend/src/api/v1/controllers/content.controller.js

export const updateContent = asyncHandler(async (req, res) => {
  const contentService = new ContentService(req.models.Content, req.models.ActivityLog);
  const { page } = req.body;
  if (!page) throw new ValidationError('Page field required');
  
  // Extract user info safely
  const userId = req.user?.sub || req.user?.id || null;
  const username = req.user?.username || req.user?.email || req.user?.name || 'system';
  
  console.log('Updating content - User:', { userId, username, page });
  
  const updated = await contentService.updateContent(
    page, 
    req.tenantId, 
    req.body, 
    userId, 
    username
  );
  
  return successResponse(res, 200, 'Content updated', ContentTransformer.toResponse(updated));
});

export const updateSection = asyncHandler(async (req, res) => {
  const contentService = new ContentService(req.models.Content, req.models.ActivityLog);
  const { page, section } = req.params;
  const { content } = req.body;
  const updated = await contentService.updateSection(page, section, content, req.tenantId, req.user.sub);
  return successResponse(res, 200, 'Section updated', ContentTransformer.toResponse(updated));
});

export const deleteContent = asyncHandler(async (req, res) => {
  const contentService = new ContentService(req.models.Content, req.models.ActivityLog);
  await contentService.deleteContent(req.params.id, req.tenantId);
  return successResponse(res, 204, 'Content deleted');
});

export const togglePublish = asyncHandler(async (req, res) => {
  const contentService = new ContentService(req.models.Content, req.models.ActivityLog);
  const content = await contentService.togglePublish(req.params.id, req.tenantId);
  return successResponse(res, 200, 'Publish status toggled', ContentTransformer.toResponse(content));
});

// backend/src/api/v1/controllers/content.controller.js
export const getContentVersion = asyncHandler(async (req, res) => {
  const content = await contentService.getContentByPage('home', req.tenantId);
  return successResponse(res, 200, 'Content version', {
    version: content.updatedAt || content.version,
    lastUpdated: content.updatedAt
  });
});


/*import { ContentService } from '../services/content.service.js';
import { ContentTransformer } from '../transformers/content.transformer.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';
import { ValidationError } from '../../../shared/errors/ValidationError.js'; // Add this line

export const getAllContent = asyncHandler(async (req, res) => {
  const contentService = new ContentService(req.models.Content);
  const content = await contentService.getAllContent(req.tenantId);
  const transformed = content.map(c => ContentTransformer.toResponse(c));
  return successResponse(res, 200, 'Content retrieved', transformed);
});

export const getContentByPage = asyncHandler(async (req, res) => {
  const contentService = new ContentService(req.models.Content);
  const content = await contentService.getContentByPage(req.params.page, req.tenantId);
  return successResponse(res, 200, 'Content retrieved', ContentTransformer.toResponse(content));
});

export const updateContent = asyncHandler(async (req, res) => {
  const contentService = new ContentService(req.models.Content);
  const { page } = req.body;
  if (!page) throw new ValidationError('Page field required');
  const updated = await contentService.updateContent(page, req.tenantId, req.body, req.user.sub, req.user.username);
  return successResponse(res, 200, 'Content updated', ContentTransformer.toResponse(updated));
});

export const updateSection = asyncHandler(async (req, res) => {
  const contentService = new ContentService(req.models.Content);
  const { page, section } = req.params;
  const { content } = req.body;
  const updated = await contentService.updateSection(page, section, content, req.tenantId, req.user.sub);
  return successResponse(res, 200, 'Section updated', ContentTransformer.toResponse(updated));
});

export const deleteContent = asyncHandler(async (req, res) => {
  const contentService = new ContentService(req.models.Content);
  await contentService.deleteContent(req.params.id, req.tenantId);
  return successResponse(res, 204, 'Content deleted');
});

export const togglePublish = asyncHandler(async (req, res) => {
  const contentService = new ContentService(req.models.Content);
  const content = await contentService.togglePublish(req.params.id, req.tenantId);
  return successResponse(res, 200, 'Publish status toggled', ContentTransformer.toResponse(content));
});*/
/*import { ContentService } from '../services/content.service.js';
import { ContentTransformer } from '../transformers/content.transformer.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

const contentService = new ContentService();

export const getAllContent = asyncHandler(async (req, res) => {
  const content = await contentService.getAllContent(req.tenantId);
  const transformed = content.map(c => ContentTransformer.toResponse(c));
  return successResponse(res, 200, 'Content retrieved', transformed);
});

export const getContentByPage = asyncHandler(async (req, res) => {
  const content = await contentService.getContentByPage(req.params.page, req.tenantId);
  return successResponse(res, 200, 'Content retrieved', ContentTransformer.toResponse(content));
});

export const updateContent = asyncHandler(async (req, res) => {
  const { page } = req.body;
  if (!page) throw new ValidationError('Page field required');
  const updated = await contentService.updateContent(page, req.tenantId, req.body, req.user.sub, req.user.username);
  return successResponse(res, 200, 'Content updated', ContentTransformer.toResponse(updated));
});

export const updateSection = asyncHandler(async (req, res) => {
  const { page, section } = req.params;
  const { content } = req.body;
  const updated = await contentService.updateSection(page, section, content, req.tenantId, req.user.sub);
  return successResponse(res, 200, 'Section updated', ContentTransformer.toResponse(updated));
});

export const deleteContent = asyncHandler(async (req, res) => {
  await contentService.deleteContent(req.params.id, req.tenantId);
  return successResponse(res, 204, 'Content deleted');
});

export const togglePublish = asyncHandler(async (req, res) => {
  const content = await contentService.togglePublish(req.params.id, req.tenantId);
  return successResponse(res, 200, 'Publish status toggled', ContentTransformer.toResponse(content));
});*/

/*last stable version
// controllers/contentController.js

console.log('✅ contentController.js loaded');

exports.getAllContent = async (req, res) => {
  console.log('📄 [Content] GET all');

  try {
    const Content = req.models.Content;
    const content = await Content.find().sort({ page: 1 });
    res.json(content);
  } catch (error) {
    console.error('❌ Content error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};
// controllers/contentController.js (partial - replace updateContent)

exports.updateContent = async (req, res) => {
  console.log('✏️ [Content] Update');

  try {
    const Content = req.models.Content;
    const ActivityLog = req.models.ActivityLog;

    const { page = 'home', ...data } = req.body;

    const content = await Content.findOneAndUpdate(
      { page },
      { ...data, updatedAt: new Date() },
      { returnDocument: 'after', upsert: true }  // ✅ fix deprecation warning
    );

    // Safely create activity log – fallback username if not available
    const username = req.user?.username || req.user?.email || 'system';
    await ActivityLog.create({
      action: 'content_update',
      label: `Updated ${page} content`,
      user: username,
      userId: req.user?.id || null,
      detail: `Updated by ${username}`
    }).catch(err => console.warn('⚠️ Could not log activity:', err.message));

    res.json(content);
  } catch (error) {
    console.error('❌ Update content error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};
/*
exports.updateContent = async (req, res) => {
  console.log('✏️ [Content] Update');

  try {
    const Content = req.models.Content;
    const ActivityLog = req.models.ActivityLog;

    const { page, ...data } = req.body;

    const content = await Content.findOneAndUpdate(
      { page },
      { ...data, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    await ActivityLog.create({
      action: 'content_update',
      label: `Updated ${page}`,
      user: req.user?.username
    });

    res.json(content);
  } catch (error) {
    console.error('❌ Update content error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};/

exports.updateSection = async (req, res) => {
  console.log(`✏️ [Content] Update section: ${req.params.page}/${req.params.section}`);
  try {
    const Content = req.models.Content;
    const { page, section } = req.params;
    const { content } = req.body;

    // Update specific section logic (adjust to your schema)
    const existing = await Content.findOne({ page });
    if (!existing) {
      return res.status(404).json({ error: 'Page not found' });
    }

    existing.sections = existing.sections || {};
    existing.sections[section] = content;
    existing.updatedAt = new Date();
    await existing.save();

    res.json(existing);
  } catch (error) {
    console.error('❌ Update section error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteContent = async (req, res) => {
  console.log(`🗑️ [Content] Delete: ${req.params.id}`);
  try {
    const Content = req.models.Content;
    const deleted = await Content.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json({ message: 'Content deleted' });
  } catch (error) {
    console.error('❌ Delete content error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.togglePublish = async (req, res) => {
  console.log(`📢 [Content] Toggle publish: ${req.params.id}`);
  try {
    const Content = req.models.Content;
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    content.published = !content.published;
    await content.save();
    res.json(content);
  } catch (error) {
    console.error('❌ Toggle publish error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.getContentByPage = async (req, res) => {
  console.log(`📄 [Content] GET page: ${req.params.page}`);
  try {
    const Content = req.models.Content;
    const page = req.params.page;

    const content = await Content.findOne({ page });
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.error('❌ getContentByPage error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

console.log('✅ All contentController exports ready:', Object.keys(module.exports));*/

/*console.log('✅ contentController.js loaded');

exports.getAllContent = async (req, res) => {
  console.log('📄 [Content] GET all');

  try {
    const Content = req.models.Content;

    const content = await Content.find().sort({ page: 1 });

    res.json(content);
    console.log('✅ getAllContent exported');

  } catch (error) {
    console.error('❌ Content error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.updateContent = async (req, res) => {
  console.log('✏️ [Content] Update');

  try {
    const Content = req.models.Content;
    const ActivityLog = req.models.ActivityLog;

    const { page, ...data } = req.body;

    const content = await Content.findOneAndUpdate(
      { page },
      { ...data, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    await ActivityLog.create({
      action: 'content_update',
      label: `Updated ${page}`,
      user: req.user?.username
    });

    res.json(content);
    console.log('✅ updateContent exported');

  } catch (error) {
    console.error('❌ Update content error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};
// controllers/contentController.js

// Add this function:
exports.getContentByPage = async (req, res) => {
  console.log(`📄 [Content] GET page: ${req.params.page}`);

  try {
    const Content = req.models.Content;
    const page = req.params.page;

    const content = await Content.findOne({ page });
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(content);
    console.log('✅ getContentByPage exported');
  } catch (error) {
    console.error('❌ getContentByPage error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};*/


/*const SiteContent = require('../models/Content');
const ActivityLog = require('../models/ActivityLog');

// Get all content
exports.getAllContent = async (req, res) => {
  try {
    const content = await SiteContent.find().sort({ page: 1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get content by page
exports.getContentByPage = async (req, res) => {
  try {
    const { page } = req.params;
    const content = await SiteContent.findOne({ 
      page,
      published: true 
    });
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create or update content
exports.updateContent = async (req, res) => {
  try {
    const { page, ...contentData } = req.body;
    
    const content = await SiteContent.findOneAndUpdate(
      { page },
      {
        ...contentData,
        updatedAt: new Date(),
        updatedBy: req.user?.username || 'system',
        $inc: { version: 1 }
      },
      { upsert: true, new: true }
    );

    // Log activity
    await ActivityLog.create({
      action: 'content_update',
      label: `Content updated: ${page}`,
      detail: `${page} page content updated`,
      user: req.user?.username || 'system',
      userId: req.user?.id,
      metadata: { page, version: content.version }
    });
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update specific section
exports.updateSection = async (req, res) => {
  try {
    const { page, section } = req.params;
    const sectionData = req.body;
    
    const updateQuery = {};
    updateQuery[section] = sectionData;
    
    const content = await SiteContent.findOneAndUpdate(
      { page },
      {
        ...updateQuery,
        updatedAt: new Date(),
        updatedBy: req.user?.username || 'system',
        $inc: { version: 1 }
      },
      { new: true }
    );

    await ActivityLog.create({
      action: 'content_update',
      label: `${section} section updated`,
      detail: `${page} page - ${section} section`,
      user: req.user?.username || 'system',
      userId: req.user?.id
    });
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete content
exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await SiteContent.findByIdAndDelete(id);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    await ActivityLog.create({
      action: 'content_update',
      label: `Content deleted: ${content.page}`,
      detail: `${content.page} page content deleted`,
      user: req.user?.username || 'system',
      userId: req.user?.id
    });
    
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle publish status
exports.togglePublish = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await SiteContent.findById(id);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    content.published = !content.published;
    await content.save();

    await ActivityLog.create({
      action: content.published ? 'content_publish' : 'content_unpublish',
      label: `Content ${content.published ? 'published' : 'unpublished'}: ${content.page}`,
      detail: `${content.page} page ${content.published ? 'published' : 'unpublished'}`,
      user: req.user?.username || 'system',
      userId: req.user?.id
    });
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/