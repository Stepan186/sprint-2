import { Request, Response, Router } from 'express';
import { authServices } from '../services/auth-services';
import { authLoginValidator, authPasswordValidator } from '../middlewares/auth-middleware';
import { inputValidatorMiddleware } from '../middlewares/blogs-middleware';

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
