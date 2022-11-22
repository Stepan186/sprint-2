import { NextFunction, Request, Response } from "express";
import { body } from 'express-validator';
import { jwtService } from '../application/jwt-service';
import { usersQueryRepository } from '../repositories/users/users-query-repository';
import { JwtPayloadInterface } from '../utilities/interfaces/auth/jwt-payload-interface';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const authorization = req.header("authorization");
  const validAuth = "Basic" + " " + btoa("admin" + ":" + "qwerty");

  if (authorization && (authorization === validAuth)) {
    next();
  } else {
    res.sendStatus(401);
  }
};

export const authLoginValidator =  body('loginOrEmail').isString()
export const authPasswordValidator = body('password').isString()

// export const permissionCommentMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//   const token: string | undefined = req.header("authorization")?.split(' ')[1];
//   if (!token) {
//     res.sendStatus(401)
//     return
//   }
//   const paylaod: JwtPayloadInterface = await jwtService.decodeToken(token) as JwtPayloadInterface
//   const user = await usersQueryRepository.findUserById(paylaod._id)
//   if (!user) {
//     res.sendStatus(401)
//     return
//   }
//   next()
// }


export const jwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.header("authorization")?.split(' ');
  const bearer = header ? header[0] : null
  const token = header ? header[1] : null;


  if (!token || !(bearer === 'Bearer') ) {
    res.sendStatus(401)
    return
  }
  const paylaod: JwtPayloadInterface = await jwtService.decodeToken(token) as JwtPayloadInterface
  const user = await usersQueryRepository.findUserById(paylaod._id)
  if (user) {
    next()
    return
  }
  res.sendStatus(401)
  return
};
