import { param } from 'express-validator';

export const switchTenantValidator = [
  param('dbName')
    .notEmpty()
    .withMessage('Database name is required')
    .matches(/^tenant_[a-f0-9-]+$/)
    .withMessage('Invalid tenant database name format'),
];