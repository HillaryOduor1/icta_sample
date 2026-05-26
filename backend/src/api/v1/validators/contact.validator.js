import { body } from 'express-validator';

export const submitContactValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters')
    .escape(),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('message')
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Message must be 5-2000 characters')
    .escape(),
];