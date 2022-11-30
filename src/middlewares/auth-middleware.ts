import { NextFunction, Request, Response } from "express";
import { body } from 'express-validator';
import { jwtService } from '../application/jwt-service';
import { usersQueryRepository } from '../repositories/users/users-query-repository';
import { JwtPayloadInterface } from '../utilities/interfaces/auth/jwt-payload-interface';
import { usersDbRepository } from '../repositories/users/users-db-repository';

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
export const codeValidator = body('code').isString()

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
  user ? next() : res.sendStatus(401)
};


export const registrationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body
  const user = await usersDbRepository.findUserByEmailOrLogin(data.email, data.login)
  if (user) {
    res.status(400).send({ errorsMessages: [{ message: "email or login already exist", field: "email" }] })
    return
  }
  next()
}
