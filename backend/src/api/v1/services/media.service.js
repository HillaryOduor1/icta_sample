import { MediaRepository } from '../repositories/media.repository.js';
import { ActivityRepository } from '../repositories/activity.repository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ValidationError } from '../../../shared/errors/ValidationError.js';

export class MediaService {
  constructor(mediaModel, activityModel) {
    if (!mediaModel) {
      throw new Error('MediaModel is required');
    }
    if (!activityModel) {
      throw new Error('ActivityModel is required');
    }
    this.repository = new MediaRepository(mediaModel);
    this.activityRepo = new ActivityRepository(activityModel);
  }

  async getAllMedia(tenantId) {
    return this.repository.findAllByTenant(tenantId);
  }

  async uploadMedia(file, tenantId, userId, username) {
    if (!file) throw new ValidationError('No file provided');
    
    const mediaData = {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/${file.filename}`,
      tenantId,
      uploadedBy: userId,
      uploadedByName: username,
    };
    
    const media = await this.repository.create(mediaData);
    
    await this.activityRepo.log(
      tenantId,
      'media_upload',
      `Uploaded file: ${file.originalname}`,
      userId,
      username,
      `File: ${file.originalname}, Size: ${file.size} bytes`
    );
    
    return media;
  }

  async deleteMedia(id, tenantId) {
    const media = await this.repository.findById(id, tenantId);
    if (!media) throw new AppError('Media not found', 404);
    
    await this.repository.delete(id, tenantId);
    
    // Note: You might want to also delete the physical file from storage
    // fs.unlinkSync(media.path);
    
    return media;
  }
}
/*import { MediaRepository } from '../repositories/media.repository.js';
import { ActivityRepository } from '../repositories/activity.repository.js';
import { storageService } from '../../../infrastructure/storage/storage.service.js';
import { AppError } from '../../../shared/errors/AppError.js';

const mediaRepo = new MediaRepository();
const activityRepo = new ActivityRepository();

export class MediaService {
  async getAllMedia(tenantId) {
    return mediaRepo.findAllByTenant(tenantId, { page: 1, limit: 1000 });
  }

  async uploadMedia(file, tenantId, userId, username) {
    // Upload to cloud storage (S3)
    const uploadResult = await storageService.upload(file, tenantId);
    const mediaData = {
      filename: uploadResult.key,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: uploadResult.url,
      uploadedBy: userId,
      tenantId,
    };
    const media = await mediaRepo.create(mediaData);
    await activityRepo.log(tenantId, 'media_upload', `Uploaded file: ${file.originalname}`, userId, username);
    return media;
  }

  async deleteMedia(id, tenantId) {
    const media = await mediaRepo.findById(id, tenantId);
    if (!media) throw new AppError('Media not found', 404);
    await storageService.delete(media.filename);
    await mediaRepo.delete(id, tenantId);
    await activityRepo.log(tenantId, 'media_delete', `Deleted file: ${media.originalName}`, null, 'system');
  }
}*/