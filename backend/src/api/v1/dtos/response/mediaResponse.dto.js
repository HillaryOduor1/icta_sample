export class MediaResponseDTO {
  constructor(media) {
    this.id = media._id.toString();
    this.filename = media.filename;
    this.originalName = media.originalName;
    this.mimeType = media.mimeType;
    this.size = media.size;
    this.url = media.url;
    this.uploadedBy = media.uploadedBy;
    this.createdAt = media.createdAt?.toISOString();
  }
}