import { Request, Response, Router } from "express";
import { emailValidation, loginValidatiom, passwordValidatiom } from '../middlewares/users-middleware';
import { inputValidatorMiddleware } from '../middlewares/blogs-middleware';
import {
  orderByType,
  paginationType,
  searchTermType,
} from '../repositories/blogs/blogs-query-repository';
import { usersQueryRepository } from '../repositories/users/users-query-repository';
import { authMiddleware } from '../middlewares/auth-middleware';
import { usersDbRepository } from '../repositories/users/users-db-repository';
import { usersServices } from '../services/users-services';
import { userColletion } from '../db';

export const usersRouter = Router({})

usersRouter.get('/', authMiddleware, inputValidatorMiddleware, async (req: Request, res: Response) => {

  const pagination: paginationType = {
    pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : 1,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10
  };

  const orderBy: orderByType = {
    sortBy: req.query.sortBy ? String(req.query.sortBy) : "createdAt",
    sortDirection: String(req.query.sortDirection) === "asc" ? "asc" : "desc"
  };

  const searchTerm: searchTermType = {
    searchLoginTerm: req.query.searchLoginTerm ? String(req.query.searchLoginTerm ) : null,
    searchEmailTerm: req.query.searchEmailTerm ? String(req.query.searchEmailTerm) : null
  }

  const users = await usersQueryRepository.findUsers(pagination, orderBy, searchTerm.searchLoginTerm, searchTerm.searchEmailTerm)

  res.status(200).send(users)
})

usersRouter.post('/',authMiddleware, loginValidatiom, passwordValidatiom, emailValidation, inputValidatorMiddleware, async  (req: Request, res: Response) => {
  const data = req.body
  const user = await usersServices.createUser(data)
  res.status(201).send(user)
})

usersRouter.delete('/:userId', authMiddleware, inputValidatorMiddleware, async (req: Request, res: Response) => {

  const result = await usersDbRepository.deleteUser(req.params.userId)
  if (result) {
    res.sendStatus(204)
    return
  }
  res.sendStatus(404)
})
