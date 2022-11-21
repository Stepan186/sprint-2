import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export const nameValidator = body("name")
  .isString()
  .bail()
  .trim()
  .isLength({ min: 1, max: 15 });


export const youtubeUrlValidator = body("youtubeUrl")
  .isString()
  .bail()
  .trim()
  .isLength({ max: 100 })
  .bail()
  .matches(`^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$`);

export const inputValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {

    const newError = error.array().map((value) => {
      return { message: value.msg, field: value.param };
    });

    res.status(400).json({ errorsMessages: newError });
    return;
  } else {
    next();
  }
};

