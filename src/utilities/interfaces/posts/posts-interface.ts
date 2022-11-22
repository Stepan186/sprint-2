import { ObjectId } from "mongodb";
import { CommentsInterface } from '../comments/comments-interface';

export interface PostsInterface {
  id: string
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string
}

export interface PostDbInterface {
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string
}

export interface CreatePostInterface {
  "title": "string",
  "shortDescription": "string",
  "content": "string",
  "blogId": "string"
}

export interface CreatePostForBlogInterface {
  "title": "string",
  "shortDescription": "string",
  "content": "string"
}


export interface PostDb {
  _id: ObjectId,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string
}


export interface PostsResponseInteface {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: PostsInterface[]
}


