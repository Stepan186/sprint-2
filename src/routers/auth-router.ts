import { Request, Response, Router } from 'express';
import { authServices } from '../services/auth-services';
import {
  authLoginValidator,
  authPasswordValidator, checkCodeMiddleware, checkRefreshTokenMiddleware, checkUserEmailMiddleware,
  codeValidator,
  jwtMiddleware, registrationMiddleware
} from '../middlewares/auth-middleware';
import { inputValidatorMiddleware } from '../middlewares/blogs-middleware';
import { emailValidation, loginValidation, passwordValidation } from '../middlewares/users-middleware';
import { GetMeInterface } from '../utilities/interfaces/auth/jwt-payload-interface';
import { tokenCollection } from '../db';
import { refreshTokenDbRepository } from '../repositories/refresh-tokens/refresh-token-db-repository';

export const authRouter = Router({})

authRouter.post('/login',authLoginValidator, authPasswordValidator, inputValidatorMiddleware, async (req: Request, res: Response) => {
  const data = req.body
  const result = await authServices.login(data)

  if (result) {
    res.cookie("refreshToken", result.refreshToken, {httpOnly: true, secure: true} ).send({accessToken: result.accessToken})
    return
  }
  res.sendStatus(401)
})


authRouter.post('/registration', authPasswordValidator, emailValidation, loginValidation, passwordValidation, registrationMiddleware, inputValidatorMiddleware, async (req: Request, res: Response) => {
  const data = req.body
  const result = await authServices.registration(data)
  result ? res.sendStatus(204) : res.sendStatus(400)
})

authRouter.post('/registration-confirmation', codeValidator, checkCodeMiddleware, inputValidatorMiddleware, async (req: Request, res: Response) => {
  const code = req.body.code
  const result = await authServices.confirmEmail(code)
  result ? res.sendStatus(204) : res.sendStatus(400)
})

authRouter.post('/registration-email-resending', emailValidation, checkUserEmailMiddleware, inputValidatorMiddleware, async (req: Request, res: Response) => {
  const email = req.body.email
  const user = req.user!
  const result = await authServices.resending(user, email)
  result ? res.sendStatus(204) : res.sendStatus(400)
})

authRouter.get('/me', jwtMiddleware, async (req: Request, res: Response) => {
  const token = req.header('authorization')!.split(' ')[1]
  const userInfo: GetMeInterface = await authServices.getMe(token);
  res.send(userInfo);
})

authRouter.post('/refresh-token', checkRefreshTokenMiddleware, async(req: Request, res: Response) => {
  const rfToken = req.cookies.refreshToken;
  const result = await authServices.refreshToken(rfToken, req.user!);
  result ? res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: true
  }).send({ accessToken: result.accessToken }) : res.sendStatus(401);
});

authRouter.post('/logout', checkRefreshTokenMiddleware, async(req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  const result = await authServices.logout(token);
  result ? res.sendStatus(204) : res.sendStatus(401);
});

