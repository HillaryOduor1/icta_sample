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

