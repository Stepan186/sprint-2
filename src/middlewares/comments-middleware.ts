import { body } from 'express-validator';

export const contentValidator = body('content').isString().trim().isLength({max: 300, min: 20})
