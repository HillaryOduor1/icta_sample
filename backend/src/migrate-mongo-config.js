// migrate-mongo-config.js
import { config } from './config/env';
export default {
  mongodb: { url: config.mongodbUri, databaseName: 'master' },
  migrationsDir: 'src/database/migrations',
  changelogCollectionName: 'changelog',
};
