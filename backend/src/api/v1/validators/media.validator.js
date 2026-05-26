import { param } from 'express-validator';

export const mediaIdParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid media ID'),
];