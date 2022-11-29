import { Request, Response, Router } from "express";
import { authMiddleware, jwtMiddleware } from '../middlewares/auth-middleware';
import {
  blogIdValidation,
  contentValidation,
  shortDescriptionValidation,
  titileValidation
} from '../middlewares/posts-middleware';
import { inputValidatorMiddleware } from "../middlewares/blogs-middleware";
import { postsRepository } from "../repositories/posts/posts-db-repository";
import { postsQueryRepository } from "../repositories/posts/posts-query-repository";
import { CreatePostInterface } from "../utilities/interfaces/posts/posts-interface";
import { orderByType, paginationType } from "../repositories/blogs/blogs-query-repository";
import { contentValidator } from '../middlewares/comments-middleware';
import { CommentsInterface } from '../utilities/interfaces/comments/comments-interface';
import { postsServices } from '../services/posts-services';

export const postsRouter = Router({});

postsRouter.get("/", async(req: Request, res: Response) => {

  let pagination: paginationType = {
    pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : 1,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10
  };

  const orderBy: orderByType = {
    sortBy: req.query.sortBy ? String(req.query.sortBy) : "createdAt",
    sortDirection: String(req.query.sortDirection) === "asc" ? "asc" : "desc"
  };

  const posts = await postsQueryRepository.findPosts(pagination, orderBy);
  res.send(posts);
});

postsRouter.get("/:id", async (req: Request, res: Response) => {
  const post = await postsQueryRepository.findPostById(req.params.id);

  if (post) {
    res.send(post);
  } else {
    res.sendStatus(404);
  }
});

postsRouter.post("/", authMiddleware, titileValidation,
  shortDescriptionValidation, contentValidation, blogIdValidation, inputValidatorMiddleware,async (req: Request, res: Response) => {
    const data: CreatePostInterface = req.body;
    const newPost = await postsRepository.createPost(data);

    if (newPost) {
      res.status(201).send(newPost);
    } else {
      res.sendStatus(404);
    }
  });


postsRouter.put("/:id", authMiddleware, titileValidation,
  shortDescriptionValidation, contentValidation, blogIdValidation, inputValidatorMiddleware,async (req: Request, res: Response) => {

    const data = req.body;

    const isUpdated = await postsRepository.updatePost(req.params.id, data);

    if (isUpdated) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  });


postsRouter.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  const isDelited = await postsRepository.deletePost(req.params.id);
  if (isDelited) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});


postsRouter.post('/:postId/comments', jwtMiddleware, contentValidator, inputValidatorMiddleware, async (req: Request, res: Response) => {
  const data = req.body
  const token = req.header('authorization')?.split(' ')[1]
  const result: CommentsInterface | null = await postsServices.createCommentForPost(token, data, req.params.postId)
  result ? res.status(201).send(result) : res.send(404)
})

postsRouter.get('/:postId/comments', async (req: Request, res: Response) => {

  let pagination: paginationType = {
    pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : 1,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10
  };

  const orderBy: orderByType = {
    sortBy: req.query.sortBy ? String(req.query.sortBy) : "createdAt",
    sortDirection: String(req.query.sortDirection) === "asc" ? "asc" : "desc"
  };

  const comments = await postsServices.findCommentsFromPost(req.params.postId, pagination, orderBy)
  comments ? res.send(comments) : res.sendStatus(404)
})
