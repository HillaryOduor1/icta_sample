export class ActivityResponseDTO {
  constructor(log) {
    this.id = log._id.toString();
    this.action = log.action;
    this.label = log.label;
    this.detail = log.detail;
    this.user = log.user;
    this.userId = log.userId;
    this.timestamp = log.timestamp?.toISOString();
    this.metadata = log.metadata;
  }
}