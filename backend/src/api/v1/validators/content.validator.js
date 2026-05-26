import { body, param } from 'express-validator';

export const updateContentValidator = [
  body('page')
    .isIn(['home', 'about', 'research', 'contact'])
    .withMessage('Page must be home, about, research, or contact'),
  body('published')
    .optional()
    .isBoolean()
    .withMessage('Published must be a boolean'),
];

export const pageParamValidator = [
  param('page')
    .isIn(['home', 'about', 'research', 'contact'])
    .withMessage('Page must be home, about, research, or contact'),
];

export const contentIdParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid content ID'),
];