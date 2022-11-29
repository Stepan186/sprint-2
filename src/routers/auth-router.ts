import { Request, Response, Router } from 'express';
import { authServices } from '../services/auth-services';
import { authLoginValidator, authPasswordValidator, codeValidator } from '../middlewares/auth-middleware';
import { inputValidatorMiddleware } from '../middlewares/blogs-middleware';
import { emailValidation } from '../middlewares/users-middleware';

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


authRouter.post('/registration', authPasswordValidator, emailValidation, inputValidatorMiddleware, async (req: Request, res: Response) => {
  const data = req.body
  const result = await authServices.registration(data)
  console.log(result);
  result ? res.sendStatus(204) : res.sendStatus(400)

})

authRouter.post('/registration-confirmastion', codeValidator, inputValidatorMiddleware, async (req: Request, res: Response) => {
  const code = req.body.code
  const result = await authServices.confirmEmail(code)
  result ? res.sendStatus(204) : res.sendStatus(400)
})


authRouter.post('/registration-email-resending', emailValidation, inputValidatorMiddleware, async (req: Request, res: Response) => {
  const email = req.body.email
  const result = await authServices.resending(email)
  result ? res.sendStatus(204) : res.sendStatus(400)
})
