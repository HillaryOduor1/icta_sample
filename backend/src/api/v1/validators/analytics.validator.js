import { query, body } from 'express-validator';

export const rangeQueryValidator = [
  query('range')
    .optional()
    .isIn(['1d', '7d', '30d', '90d', 'current_month'])
    .withMessage('Range must be 1d, 7d, 30d, 90d, or current_month'),
];

export const pageQueryValidator = [
  query('page')
    .optional()
    .isString()
    .withMessage('Page must be a string'),
];

export const trackEventValidator = [
  body('visitorId')
    .notEmpty()
    .withMessage('visitorId is required'),
  body('sessionId')
    .notEmpty()
    .withMessage('sessionId is required'),
  body('type')
    .optional()
    .isIn(['pageview', 'event', 'funnel_step', 'heatmap'])
    .withMessage('Type must be pageview, event, funnel_step, or heatmap'),
];

export const trackHeatmapValidator = [
  body('*.page')
    .notEmpty()
    .withMessage('Each heatmap event must have a page'),
  body('*.x')
    .isFloat({ min: 0, max: 1 })
    .withMessage('x coordinate must be between 0 and 1'),
  body('*.y')
    .isFloat({ min: 0, max: 1 })
    .withMessage('y coordinate must be between 0 and 1'),
];