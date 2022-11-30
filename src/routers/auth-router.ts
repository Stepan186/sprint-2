import { Request, Response, Router } from 'express';
import { authServices } from '../services/auth-services';
import {
  authLoginValidator,
  authPasswordValidator,
  codeValidator, confirmationCodeMiddleware, confirmationEmailMiddleware, emailResendingMiddleware,
  jwtMiddleware, registrationMiddleware
} from '../middlewares/auth-middleware';
import { inputValidatorMiddleware } from '../middlewares/blogs-middleware';
import { emailValidation } from '../middlewares/users-middleware';
import { jwtService } from '../application/jwt-service';
import { GetMeInterface } from '../utilities/interfaces/auth/jwt-payload-interface';

export const authRouter = Router({})

authRouter.post('/login',authLoginValidator, authPasswordValidator, inputValidatorMiddleware, async (req: Request, res: Response) => {
  const data = req.body
  const result = await authServices.login(data)

  if (result) {
    res.send(result)
    return
  }
  res.sendStatus(401)
})


authRouter.post('/registration', authPasswordValidator, emailValidation, registrationMiddleware, inputValidatorMiddleware, async (req: Request, res: Response) => {
  const data = req.body
  const result = await authServices.registration(data)
  result ? res.sendStatus(204) : res.sendStatus(400)
})

authRouter.post('/registration-confirmation', codeValidator, confirmationEmailMiddleware, confirmationCodeMiddleware, inputValidatorMiddleware, async (req: Request, res: Response) => {
  const code = req.body.code
  const result = await authServices.confirmEmail(code)
  result ? res.sendStatus(204) : res.sendStatus(400)
})

authRouter.post('/registration-email-resending', emailValidation, emailResendingMiddleware, inputValidatorMiddleware, async (req: Request, res: Response) => {
  const email = req.body.email
  const result = await authServices.resending(email)
  result ? res.sendStatus(204) : res.sendStatus(400)
})

authRouter.get('/me', jwtMiddleware, async (req: Request, res: Response) => {
  const token = req.header('authorization')?.split(' ')[1]

  if (token) {
    const userInfo: GetMeInterface = await authServices.getMe(token)
    res.send(userInfo)
  }
})
