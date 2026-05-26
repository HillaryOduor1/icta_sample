import { ContentRepository } from '../repositories/content.repository.js';
import { ActivityRepository } from '../repositories/activity.repository.js';
import { CreateContentDTO } from '../dtos/request/createContent.dto.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class ContentService {
  constructor(contentModel, activityModel) {
    if (!contentModel) {
      throw new Error('ContentModel is required');
    }
    if (!activityModel) {
      throw new Error('ActivityModel is required');
    }
    this.contentRepo = new ContentRepository(contentModel);
    this.activityRepo = new ActivityRepository(activityModel);
  }

  async getAllContent(tenantId) {
    return this.contentRepo.findAllByTenant(tenantId);
  }

  async getContentByPage(page, tenantId) {
    const content = await this.contentRepo.findByPage(page, tenantId);
    if (!content) throw new AppError('Content not found', 404);
    return content;
  }

  
 /*async updateContent(page, tenantId, data, userId, username) {
  const dto = new CreateContentDTO({ ...data, page });
  dto.validate();

  const updated = await this.contentRepo.upsertByPage(page, tenantId, data, username || 'system');
  
  // Log the activity with correct parameter order
  await this.activityRepo.log(
    tenantId,           // tenantId
    'content_update',   // action
    `Updated content for page: ${page}`, // label
    userId || 'system', // userId
    username || 'system', // username
    JSON.stringify({ page, fields: Object.keys(data) }), // detail
    { page, timestamp: new Date() } // metadata
  ).catch(err => console.error('Failed to log activity:', err)); // Don't let logging fail the operation
  
  return updated;
}*/
async updateContent(page, tenantId, data, userId, username) {
  const dto = new CreateContentDTO({ ...data, page });
  dto.validate();

  // Prepare update data - include all sections
  const updateData = {
    ...data,
    tenantId,
    updatedBy: username || 'system',
    userId: userId || 'system',
    username: username || 'system',
    updatedAt: new Date(),
    $inc: { version: 1 }
  };
  
  // Remove any internal fields that shouldn't be stored
  delete updateData._id;
  delete updateData.__v;
  delete updateData.createdAt;
  delete updateData.tenantId; // Already set above
  
  const updated = await this.contentRepo.upsertByPage(page, tenantId, updateData, username);
  
  // Log the activity
  await this.activityRepo.log(
    tenantId,
    'content_update',
    `Updated content for page: ${page}`,
    userId || 'system',
    username || 'system',
    JSON.stringify({ page, fields: Object.keys(data) }),
    { page, timestamp: new Date() }
  ).catch(err => console.error('Failed to log activity:', err));
  
  return updated;
}

async updateSection(page, section, contentData, tenantId, userId) {
  const existing = await this.contentRepo.findByPage(page, tenantId);
  if (!existing) throw new AppError('Page not found', 404);
  existing.sections = existing.sections || {};
  existing.sections[section] = contentData;
  existing.updatedAt = new Date();
  const updated = await this.contentRepo.update(existing._id, tenantId, { sections: existing.sections, updatedAt: new Date() });
  
  await this.activityRepo.log(
    tenantId,
    'content_section_update',
    `Updated section ${section} on page ${page}`,
    userId || 'system',
    'system',
    null,
    { page, section }
  ).catch(err => console.error('Failed to log activity:', err));
  
  return updated;
}

  async deleteContent(id, tenantId) {
    const deleted = await this.contentRepo.delete(id, tenantId);
    if (!deleted) throw new AppError('Content not found', 404);
  }

  async togglePublish(id, tenantId) {
    const content = await this.contentRepo.findById(id, tenantId);
    if (!content) throw new AppError('Content not found', 404);
    const updated = await this.contentRepo.update(id, tenantId, { published: !content.published });
    return updated;
  }
}
