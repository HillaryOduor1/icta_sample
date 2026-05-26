import EventEmitter from 'events';

class EventBus extends EventEmitter {}
export const eventBus = new EventBus();

// Event names constants
export const EVENTS = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  CONTENT_UPDATED: 'content.updated',
  SETTINGS_UPDATED: 'settings.updated',
  MEDIA_UPLOADED: 'media.uploaded',
};