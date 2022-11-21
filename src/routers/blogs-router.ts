import { Request, Response, Router } from "express";
import {
  inputValidatorMiddleware,
  nameValidator,
  youtubeUrlValidator
} from "../middlewares/blogs-middleware";
import { authMiddleware } from "../middlewares/auth-middleware";
import { BlogInterface, IBlogView } from "../utilities/interfaces/blogs/blog-interface";
import { blogsQueryRepository, orderByType, paginationType } from "../repositories/blogs/blogs-query-repository";
import { blogsServices } from "../services/blogs-services";
import { CreatePostForBlogInterface, PostsResponseInteface } from "../utilities/interfaces/posts/posts-interface";
import { BlogsResponseInterface } from "../utilities/interfaces/blogs/blogs-response-interface";
import {
  blogIdValidation,
  contentValidation,
  shortDescriptionValidation,
  titileValidation
} from "../middlewares/posts-middleware";

export const blogsRouter = Router({});

blogsRouter.get("/", async(req: Request, res: Response) => {

  const searchNameTerm: string | null = req.query.searchNameTerm ? String(req.query.searchNameTerm) : null

  const pagination: paginationType = {
    pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : 1,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10
  };

  const orderBy: orderByType = {
    sortBy: req.query.sortBy ? String(req.query.sortBy) : "createdAt",
    sortDirection: String(req.query.sortDirection) === "asc" ? "asc" : "desc"
  };

  const blogs: BlogsResponseInterface = await blogsQueryRepository.findBlogs(pagination, orderBy, searchNameTerm);
  res.send(blogs);
});

blogsRouter.get("/:id", async(req: Request, res: Response) => {

  const blog = await blogsQueryRepository.findBlogById(req.params.id);

  if (blog) {
    res.send(blog);
  } else {
    res.send(404);
  }

});

blogsRouter.post("/", authMiddleware, nameValidator, youtubeUrlValidator, inputValidatorMiddleware, async(req: Request, res: Response) => {
  const data = req.body;
  const newBlog: BlogInterface = await blogsServices.createBlog(data);
  res.status(201).send(newBlog);
});

blogsRouter.put("/:id", authMiddleware, nameValidator, youtubeUrlValidator, inputValidatorMiddleware, async(req: Request, res: Response) => {
  const data = req.body;
  const isUpdated = await blogsServices.updateBlog(req.params.id, data);
  if (isUpdated) {
    res.send(204);
  } else {
    res.send(404);
  }
});

blogsRouter.delete("/:id", authMiddleware, async(req: Request, res: Response) => {
  const isDeleted = await blogsServices.deleteBlog(req.params.id);
  if (isDeleted) {
    res.send(204);
  } else {
    res.send(404);
  }
});

blogsRouter.get("/:blogId/posts", async(req: Request, res: Response) => {

  let pagination: paginationType = {
    pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : 1,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10
  };

  const orderBy: orderByType = {
    sortBy: req.query.sortBy ? String(req.query.sortBy) : "createdAt",
    sortDirection: String(req.query.sortDirection) === "asc" ? "asc" : "desc"
  };

  const posts: PostsResponseInteface | boolean  = await blogsServices.getPostsForBlog(pagination, orderBy, req.params.blogId);
  if (posts) {
    res.status(200).send(posts)
  } else {
    res.sendStatus(404)
  }
});


blogsRouter.post("/:blogId/posts", authMiddleware, titileValidation,
  shortDescriptionValidation, contentValidation,inputValidatorMiddleware, async(req: Request, res: Response) => {
  const data: CreatePostForBlogInterface = req.body;
  const post = await blogsServices.createPostForBlog(req.params.blogId, data);
  if (post) {
    res.status(201).send(post);
  }
  else {
    res.sendStatus(404)
  }
});

