import { Request, Response, Router } from 'express';
import { commentsQueryRepository } from '../repositories/comments/comments-query-repository';
import { inputValidatorMiddleware } from '../middlewares/blogs-middleware';
import { CreateCommentInterface } from '../utilities/interfaces/comments/comments-interface';
import { jwtMiddleware } from '../middlewares/auth-middleware';
import { commentsServices } from '../services/comments-services';
import { contentValidator } from '../middlewares/comments-middleware';

export const commentsRouter = Router({})

commentsRouter.get('/:commentId', async (req: Request, res: Response) => {
  const comment = await commentsQueryRepository.findComment(req.params.commentId)
  comment ? res.send(comment) : res.sendStatus(404)
})

commentsRouter.delete('/:commentId', jwtMiddleware, inputValidatorMiddleware, async (req: Request, res: Response) => {
  const token = req.header('authorization')?.split(' ')[1]
  if (token) {
    const result = await commentsServices.deleteComment(req.params.commentId, token)
    result ? res.sendStatus(204) : res.sendStatus(403)
  }
})

commentsRouter.put('/:commentId', jwtMiddleware, contentValidator, inputValidatorMiddleware,  async (req: Request, res: Response) => {
  const data: CreateCommentInterface = req.body
  const token = req.header('authorization')?.split(' ')[1]
  if (token) {
    const result = await commentsServices.updateComment(req.params.commentId, data, token)
    result ? res.sendStatus(204) : res.sendStatus(403)
  }
})




