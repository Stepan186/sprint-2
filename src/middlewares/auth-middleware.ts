import { NextFunction, Request, Response } from "express";
import { body } from 'express-validator';
import { jwtService } from '../application/jwt-service';
import { usersQueryRepository } from '../repositories/users/users-query-repository';
import { JwtPayloadInterface } from '../utilities/interfaces/auth/jwt-payload-interface';
import { usersDbRepository } from '../repositories/users/users-db-repository';
import { tokenCollection } from '../db';
import { refreshTokenDbRepository } from '../repositories/refresh-tokens/refresh-token-db-repository';

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
  const payload: JwtPayloadInterface = await jwtService.decodeToken(token) as JwtPayloadInterface
  const user = await usersQueryRepository.findUserById(payload._id)
  user ? next() : res.sendStatus(401)
};

export const registrationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body
  const user = await usersDbRepository.findUserByEmailOrLogin(data.email, data.login)
  if (user && user.email === data.email) {
    res.status(400).send({ errorsMessages: [{ message: "this email already exist", field: "email" }] })
    return
  }
  if (user && user.login === data.login) {
    res.status(400).send({ errorsMessages: [{ message: "this login already exist", field: "login" }] })
    return
  }
  next()
}


export const checkUserEmailMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const user = await usersDbRepository.findUserByEmail(req.body.email)
  if (!user) {
    res.status(400).send({ errorsMessages: [{ message: 'user with this email does not exist', field: "email" }] })
    return
  }

  if (user && user.emailConfirm) {
    res.status(400).send({ errorsMessages: [{ message: 'email already confirmed', field: 'email' }] });
    return;
  }

  req.user = user
  next()
}

export const checkCodeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const user = await usersDbRepository.findUserByCode(req.body.code)
  if (!user) {
    res.status(400).send({ errorsMessages: [{ message: "invalid code", field: 'code' }] })
    return
  }

  if (user && user.emailConfirm) {
    res.status(400).send({ errorsMessages: [{ message: "invalid code", field: 'code' }] })
    return
  }
  req.user = user
  return next()
}

export const checkRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const rfToken: string | undefined = req.cookies.refershToken
  if (!rfToken) {
    res.sendStatus(401)
    return
  }

  const checkToken = await refreshTokenDbRepository.findRfRoken(rfToken)
  if (checkToken) {
    res.sendStatus(401)
    return
  }
  const payload: JwtPayloadInterface = await jwtService.decodeToken(rfToken) as JwtPayloadInterface
  const user = await usersDbRepository.findUserByEmail(payload.email)
  if (!user) {
    res.sendStatus(401)
    return
  }
  req.user = user
  next()
}
