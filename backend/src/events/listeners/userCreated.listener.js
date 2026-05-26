import { eventBus, EVENTS } from '../eventBus.js';
import { logger } from '../../config/logger.js';

export const setupUserListeners = () => {
  eventBus.on(EVENTS.USER_CREATED, async (user) => {
    logger.info({ user: user.id }, 'User created event received');
    // Example: send welcome email, create default preferences, etc.
  });
};