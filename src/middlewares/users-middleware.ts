import { body } from 'express-validator';

export const loginValidation = body('login').isString().trim().isLength({max: 10, min: 3})
export const passwordValidation = body('password').isString().trim().isLength({max: 20, min: 6})
export const emailValidation = body('email').matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
